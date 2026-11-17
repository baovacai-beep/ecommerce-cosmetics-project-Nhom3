<?php
declare(strict_types=1);

/**
 * CassoService
 * Kiểm tra đối soát giao dịch chuyển khoản qua Casso API v2 (có timeout & chế độ fallback đồ án).
 */
class CassoService
{
    public static function verifyTransfer(string $orderCode, int $expectedAmount): array
    {
        $integrations = require dirname(__DIR__) . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'integrations.php';
        $apiKey = trim((string) ($integrations['casso']['api_key'] ?? ''));

        if ($apiKey === '' || !function_exists('curl_init')) {
            return [
                'verified' => true,
                'mode' => 'simulation_fallback',
                'message' => 'Đã xác nhận thanh toán theo chế độ mô phỏng đồ án (chưa cấu hình CASSO_API_KEY).',
            ];
        }

        $memo = preg_replace('/[^A-Z0-9]/', '', strtoupper($orderCode));
        $ch = curl_init('https://oauth.casso.vn/v2/transactions?pageSize=20&sort=DESC');
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
        $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($resp === false || $httpCode >= 400) {
            return [
                'verified' => false,
                'mode' => 'casso_error',
                'message' => 'Không thể kết nối Casso lúc này. Đơn hàng vẫn được lưu chờ nhân viên đối soát thủ công.',
            ];
        }

        $decoded = json_decode((string) $resp, true);
        $records = $decoded['data']['records'] ?? [];
        foreach ($records as $tx) {
            $desc = strtoupper((string) ($tx['description'] ?? ''));
            $amt = (int) ($tx['amount'] ?? 0);
            if ($amt >= $expectedAmount && str_contains(preg_replace('/[^A-Z0-9]/', '', $desc) ?? '', $memo)) {
                return [
                    'verified' => true,
                    'mode' => 'casso_live',
                    'message' => 'Đã đối soát tự động giao dịch ngân hàng thành công.',
                ];
            }
        }

        return [
            'verified' => false,
            'mode' => 'pending_bank',
            'message' => 'Chưa ghi nhận giao dịch khớp mã ' . $orderCode . '. Vui lòng kiểm tra nội dung chuyển khoản.',
        ];
    }
}
