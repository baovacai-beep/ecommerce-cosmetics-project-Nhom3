<?php
declare(strict_types=1);

/**
 * VietQrBankService
 * Sinh thông tin chuyển khoản VietQR chuẩn theo mã đơn hàng và tổng tiền.
 */
class VietQrBankService
{
    public static function buildPaymentPayload(string $orderCode, int $amount): array
    {
        $integrations = require dirname(__DIR__) . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'integrations.php';
        $cfg = $integrations['vietqr'];

        $bankId = (string) ($cfg['bank_id'] ?: 'MB');
        $accountNo = (string) ($cfg['account_no'] ?: '0388889999');
        $accountName = (string) ($cfg['account_name'] ?: 'BAKEMATE STORE');
        $cleanMemo = 'THANH TOAN ' . preg_replace('/[^A-Z0-9]/', '', strtoupper($orderCode));
        $safeAmount = max(0, $amount);

        $qrImageUrl = sprintf(
            'https://img.vietqr.io/image/%s-%s-compact2.png?amount=%d&addInfo=%s&accountName=%s',
            rawurlencode($bankId),
            rawurlencode($accountNo),
            $safeAmount,
            rawurlencode($cleanMemo),
            rawurlencode($accountName)
        );

        return [
            'bank_id' => $bankId,
            'account_no' => $accountNo,
            'account_name' => $accountName,
            'amount' => $safeAmount,
            'transfer_memo' => $cleanMemo,
            'qr_image_url' => $qrImageUrl,
        ];
    }
}
