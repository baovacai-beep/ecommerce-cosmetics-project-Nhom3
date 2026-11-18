<?php
declare(strict_types=1);

/**
 * VietQrBankService
 * Sinh thông tin chuyển khoản VietQR chuẩn theo mã đơn hàng và tổng tiền.
 */
class VietQrBankService
{
    private const ALLOWED_TEMPLATES = ['compact', 'compact2', 'qr_only', 'print'];

    public static function getConfig(): array
    {
        $integrations = require dirname(__DIR__) . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'integrations.php';
        $cfg = $integrations['vietqr'] ?? [];

        return [
            'bank_id' => trim((string) ($cfg['bank_id'] ?? '')) ?: 'MB',
            'account_no' => trim((string) ($cfg['account_no'] ?? '')) ?: '0388889999',
            'account_name' => trim((string) ($cfg['account_name'] ?? '')) ?: 'BAKEMATE STORE',
        ];
    }

    public static function normalizeOrderReference(string $orderCode): string
    {
        return preg_replace('/[^A-Z0-9]/', '', strtoupper(trim($orderCode))) ?? '';
    }

    public static function buildTransferMemo(string $orderCode): string
    {
        $reference = self::normalizeOrderReference($orderCode);
        return $reference !== '' ? 'THANH TOAN ' . $reference : 'THANH TOAN BAKEMATE';
    }

    public static function buildPaymentPayload(string $orderCode, int $amount, string $template = 'compact2'): array
    {
        $cfg = self::getConfig();
        $bankId = $cfg['bank_id'];
        $accountNo = $cfg['account_no'];
        $accountName = $cfg['account_name'];
        $safeTemplate = in_array($template, self::ALLOWED_TEMPLATES, true) ? $template : 'compact2';
        $referenceCode = self::normalizeOrderReference($orderCode);
        $cleanMemo = self::buildTransferMemo($orderCode);
        $safeAmount = max(0, $amount);

        $qrImageUrl = sprintf(
            'https://img.vietqr.io/image/%s-%s-%s.png?amount=%d&addInfo=%s&accountName=%s',
            rawurlencode($bankId),
            rawurlencode($accountNo),
            rawurlencode($safeTemplate),
            $safeAmount,
            rawurlencode($cleanMemo),
            rawurlencode($accountName)
        );

        return [
            'bank_id' => $bankId,
            'account_no' => $accountNo,
            'account_name' => $accountName,
            'amount' => $safeAmount,
            'reference_code' => $referenceCode,
            'transfer_memo' => $cleanMemo,
            'template' => $safeTemplate,
            'qr_image_url' => $qrImageUrl,
        ];
    }
}
