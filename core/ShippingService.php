<?php
declare(strict_types=1);

/**
 * ShippingService
 * Tính phí vận chuyển theo vùng (TP.HCM / Tỉnh thành), hỗ trợ kiểm tra hàng tươi lạnh (Perishable Guard)
 * và sẵn sàng mở rộng kết nối API GHN có Timeout + Fallback về bảng cước nội bộ.
 */
class ShippingService
{
    public const DEFAULT_SHIPPING_FEE = 25000;

    public const VN_LOCATIONS = [
        'TP. Hồ Chí Minh' => [
            'Quận 1' => ['zone' => 'hcm', 'wards' => ['Phường Bến Nghé', 'Phường Bến Thành', 'Phường Đa Kao', 'Phường Tân Định']],
            'Quận 3' => ['zone' => 'hcm', 'wards' => ['Phường Võ Thị Sáu', 'Phường 4', 'Phường 5', 'Phường 9']],
            'Quận 5' => ['zone' => 'hcm', 'wards' => ['Phường 1', 'Phường 4', 'Phường 8', 'Phường 11']],
            'Quận 10' => ['zone' => 'hcm', 'wards' => ['Phường 6', 'Phường 10', 'Phường 12', 'Phường 14']],
            'Quận Phú Nhuận' => ['zone' => 'hcm', 'wards' => ['Phường 1', 'Phường 5', 'Phường 9', 'Phường 15']],
            'Quận Bình Thạnh' => ['zone' => 'hcm', 'wards' => ['Phường 1', 'Phường 11', 'Phường 19', 'Phường 22']],
            'TP. Thủ Đức (Ngoại thành)' => ['zone' => 'province', 'wards' => ['Phường Hiệp Phú', 'Phường Thảo Điền', 'Phường Linh Trung', 'Phường Phước Long B']],
        ],
        'TP. Hà Nội' => [
            'Quận Đống Đa' => ['zone' => 'province', 'wards' => ['Phường Láng Thượng', 'Phường Ô Chợ Dừa', 'Phường Trung Liệt']],
            'Quận Hoàn Kiếm' => ['zone' => 'province', 'wards' => ['Phường Hàng Trống', 'Phường Tràng Tiền', 'Phường Cửa Nam']],
            'Quận Cầu Giấy' => ['zone' => 'province', 'wards' => ['Phường Dịch Vọng', 'Phường Nghĩa Tân', 'Phường Yên Hòa']],
        ],
        'TP. Đà Nẵng' => [
            'Quận Hải Châu' => ['zone' => 'province', 'wards' => ['Phường Hải Châu 1', 'Phường Thạch Thang', 'Phường Hòa Cường Bắc']],
            'Quận Thanh Khê' => ['zone' => 'province', 'wards' => ['Phường Thạc Gián', 'Phường Vĩnh Trung']],
        ],
        'Lâm Đồng' => [
            'TP. Đà Lạt' => ['zone' => 'province', 'wards' => ['Phường 1', 'Phường 3', 'Phường 8']],
        ],
        'Bình Dương' => [
            'TP. Thủ Dầu Một' => ['zone' => 'province', 'wards' => ['Phường Phú Cường', 'Phường Chánh Nghĩa', 'Phường Hiệp Thành']],
        ],
        'TP. Cần Thơ' => [
            'Quận Ninh Kiều' => ['zone' => 'province', 'wards' => ['Phường Tân An', 'Phường Xuân Khánh', 'Phường An Hòa']],
        ],
    ];

    public const SHIPPING_ZONES = [
        'hcm' => [
            'label' => 'Nội thành TP.HCM',
            'methods' => [
                ['id' => 'pickup', 'name' => 'Lấy tại cửa hàng', 'fee' => 0, 'eta' => 'Nhận trong ngày tại 59C Nguyễn Đình Chiểu, Q.3'],
                ['id' => 'fast', 'name' => 'Giao hàng nhanh', 'fee' => 20000, 'eta' => 'Dự kiến giao trong 4–6 giờ'],
                ['id' => 'express', 'name' => 'Hỏa tốc (2h)', 'fee' => 40000, 'eta' => 'Giao ngay trong vòng 2 giờ'],
            ],
        ],
        'province' => [
            'label' => 'Ngoại thành / Tỉnh khác',
            'methods' => [
                ['id' => 'ghn', 'name' => 'Giao Hàng Nhanh (GHN)', 'fee' => 30000, 'eta' => 'Dự kiến 2–3 ngày làm việc'],
                ['id' => 'ghtk', 'name' => 'Giao Hàng Tiết Kiệm (GHTK)', 'fee' => 20000, 'eta' => 'Dự kiến 3–4 ngày làm việc'],
            ],
        ],
    ];

    public static function resolveZone(string $province, string $district): string
    {
        if (isset(self::VN_LOCATIONS[$province][$district]['zone'])) {
            return (string) self::VN_LOCATIONS[$province][$district]['zone'];
        }
        $normProv = mb_strtolower(trim($province), 'UTF-8');
        $normDist = mb_strtolower(trim($district), 'UTF-8');
        if (str_contains($normProv, 'hồ chí minh') || str_contains($normProv, 'hcm')) {
            if (str_contains($normDist, 'thủ đức') || str_contains($normDist, 'ngoại thành')) {
                return 'province';
            }
            return 'hcm';
        }
        return 'province';
    }

    public static function getAvailableMethods(string $zoneType, bool $hasPerishable): array
    {
        $zoneKey = $zoneType === 'hcm' ? 'hcm' : 'province';
        $methods = self::SHIPPING_ZONES[$zoneKey]['methods'];

        if (!$hasPerishable) {
            return ['blocked' => false, 'reason' => '', 'methods' => $methods];
        }

        if ($zoneKey !== 'hcm') {
            return [
                'blocked' => true,
                'reason' => 'Đơn hàng có nguyên liệu tươi/bảo quản lạnh (Whipping Cream, Bơ lạt, Trứng gà tươi). Hiện tại BakeMate chỉ giao Hỏa tốc 2h nội thành TP.HCM hoặc Nhận tại cửa hàng.',
                'methods' => [],
            ];
        }

        // Nội thành TP.HCM có hàng tươi lạnh: chỉ cho phép Hỏa tốc 2h hoặc Lấy tại cửa hàng
        $coldMethods = array_values(array_filter($methods, static fn(array $m): bool => in_array($m['id'], ['express', 'pickup'], true)));
        return ['blocked' => false, 'reason' => '', 'methods' => $coldMethods];
    }

    public static function calculateShippingFee(string $zoneType, string $methodId, bool $hasPerishable): array
    {
        $check = self::getAvailableMethods($zoneType, $hasPerishable);
        if ($check['blocked']) {
            return ['valid' => false, 'fee' => 0, 'method_id' => $methodId, 'method_name' => '', 'reason' => $check['reason']];
        }

        foreach ($check['methods'] as $m) {
            if ($m['id'] === $methodId) {
                return [
                    'valid' => true,
                    'fee' => (int) $m['fee'],
                    'method_id' => $m['id'],
                    'method_name' => $m['name'],
                    'reason' => '',
                ];
            }
        }

        // Không tự đổi sang phương thức khác: đặc biệt tránh việc đơn hàng tươi lạnh
        // gửi lên phương thức thường nhưng server âm thầm chuyển sang pickup/express.
        return [
            'valid' => false,
            'fee' => 0,
            'method_id' => $methodId,
            'method_name' => '',
            'reason' => $hasPerishable
                ? 'Phương thức giao hàng đã chọn không hỗ trợ sản phẩm tươi/lạnh. Vui lòng chọn Hỏa tốc (2h) hoặc Lấy tại cửa hàng.'
                : 'Phương thức giao hàng không hợp lệ với khu vực nhận hàng đã chọn.',
        ];
    }
}
