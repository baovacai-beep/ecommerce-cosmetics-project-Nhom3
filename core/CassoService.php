<?php
declare(strict_types=1);

/**
 * CassoService
 * Kiểm tra đối soát giao dịch chuyển khoản qua Casso API v2 (có timeout & chế độ fallback đồ án).
 */
class CassoService
{
    private const TRANSACTIONS_ENDPOINT = 'https://oauth.casso.vn/v2/transactions?pageSize=20&sort=DESC';

    public static function matchOrderTransaction(array $records, string $orderCode, int $expectedAmount): ?array
    {
        $reference = VietQrBankService::normalizeOrderReference($orderCode);
        if ($reference === '' || $expectedAmount <= 0) {
            return null;
        }

        foreach ($records as $tx) {
            if (!is_array($tx)) {
                continue;
            }
            $cleanDesc = VietQrBankService::normalizeOrderReference((string) ($tx['description'] ?? ''));
            $amt = (int) ($tx['amount'] ?? 0);
            if ($amt >= $expectedAmount && str_contains($cleanDesc, $reference)) {
                return [
                    'transaction_id' => (string) ($tx['tid'] ?? $tx['id'] ?? ''),
                    'amount' => $amt,
                    'description' => (string) ($tx['description'] ?? ''),
                    'when' => (string) ($tx['when'] ?? ''),
                ];
            }
        }

        return null;
    }

    public static function verifyWebhookToken(string $receivedToken): bool
    {
        $integrations = require dirname(__DIR__) . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'integrations.php';
        $expectedSecret = trim((string) ($integrations['casso']['webhook_secret'] ?? ''));
        $provided = trim($receivedToken);

        if ($expectedSecret === '' || $provided === '') {
            return false;
        }

        return hash_equals($expectedSecret, $provided);
    }

    public static function verifyTransfer(string $orderCode, int $expectedAmount): array
    {
        if (VietQrBankService::normalizeOrderReference($orderCode) === '' || $expectedAmount <= 0) {
            return [
                'verified' => false,
                'mode' => 'invalid_request',
                'message' => 'Thông tin đơn hàng hoặc số tiền đối soát không hợp lệ.',
            ];
        }

        $integrations = require dirname(__DIR__) . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'integrations.php';
        $apiKey = trim((string) ($integrations['casso']['api_key'] ?? ''));

        if ($apiKey === '' || !function_exists('curl_init')) {
            return [
                'verified' => true,
                'mode' => 'simulation_fallback',
                'message' => 'Đã xác nhận thanh toán theo chế độ mô phỏng đồ án (chưa cấu hình CASSO_API_KEY).',
            ];
        }

        $ch = curl_init(self::TRANSACTIONS_ENDPOINT);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_TIMEOUT => 12,
            CURLOPT_HTTPHEADER => [
                'Authorization: Apikey ' . $apiKey,
                'Content-Type: application/json',
            ],
        ]);
        $resp = curl_exec($ch);
        $curlErr = curl_errno($ch);
        $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($resp === false || $curlErr !== 0 || $httpCode >= 400) {
            return [
                'verified' => false,
                'mode' => 'casso_error',
                'message' => 'Không thể kết nối Casso lúc này. Đơn hàng vẫn được lưu chờ nhân viên đối soát thủ công.',
            ];
        }

        $decoded = json_decode((string) $resp, true);
        $records = is_array($decoded) && isset($decoded['data']['records']) && is_array($decoded['data']['records'])
            ? $decoded['data']['records']
            : [];

        $matched = self::matchOrderTransaction($records, $orderCode, $expectedAmount);
        if ($matched !== null) {
            return [
                'verified' => true,
                'mode' => 'casso_live',
                'transaction' => $matched,
                'message' => 'Đã đối soát tự động giao dịch ngân hàng thành công.',
            ];
        }

        return [
            'verified' => false,
            'mode' => 'pending_bank',
            'message' => 'Chưa ghi nhận giao dịch khớp mã ' . $orderCode . '. Vui lòng kiểm tra nội dung chuyển khoản.',
        ];
    }
}
