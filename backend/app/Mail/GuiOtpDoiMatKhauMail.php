<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class GuiOtpDoiMatKhauMail extends Mailable
{
    use Queueable, SerializesModels;

    public $otp;
    public $hoTen;

    public function __construct($hoTen, $otp)
    {
        $this->hoTen = $hoTen;
        $this->otp = $otp;
    }

    public function build()
    {
        return $this->subject('[Nông Sản Tươi] Mã OTP xác nhận đổi mật khẩu')
            ->html("
                <div style='font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;'>
                    <h2>Xin chào {$this->hoTen},</h2>
                    <p>Bạn vừa yêu cầu đổi mật khẩu cho tài khoản tại <strong>Nông Sản Tươi</strong>.</p>
                    <p>Mã OTP xác nhận của bạn là:</p>
                    <div style='font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #047857; padding: 12px 0;'>
                        {$this->otp}
                    </div>
                    <p style='color: #666; font-size: 13px;'>Mã có hiệu lực trong vòng <strong>5 phút</strong>. Tuyệt đối không chia sẻ mã này cho bất kỳ ai.</p>
                </div>
            ");
    }
}