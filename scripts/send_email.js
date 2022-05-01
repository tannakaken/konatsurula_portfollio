const NodeMailer = require('nodemailer')
 
function sendMail (smtpData, mailData) {
 
  const transporter = NodeMailer.createTransport(smtpData)
 
  transporter.sendMail(mailData, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}
 
 
function main() {
  const smtpData = {
    host: 'smtp.gmail.com',
    port: '465',
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    }
  }
 
  // 送信内容を作成
  const mailData = {
    from: '"淡中圏" <' + smtpData.auth.user + '>',
    to: 'tannakaken@gmail.com',
    subject: '粉鶴亀のポートフォリオ更新時自動送信メール',
    html: '<p>粉鶴亀のポートフォリオが更新されました。</p><p><a href="https://www.konatsuruka.online">https://www.konatsuruka.online</a>を確認してください。</p>',
  }
 
  // メールを送信
  sendMail(smtpData, mailData)
}
 
// 実行
main()