import nodemailer, { Transporter } from 'nodemailer'
import fs from 'fs'
import handlebars from 'handlebars'

class SendMailService {
  private client: Transporter

  constructor() {
    nodemailer.createTestAccount().then(account => {
      const { host, port, secure } = account.smtp
      const { user, pass } = account

      const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user,
          pass,
        },
      })

      this.client = transporter
    })
  }

  async execute(
    to: string,
    subject: string,
    path: string,
    context: { [variable: string]: any }
  ) {
    const surveyContentTemplate = fs.readFileSync(path).toString('utf8')

    const surveyTemplateParse = handlebars.compile(surveyContentTemplate)
    const html = surveyTemplateParse(context)

    const message = await this.client.sendMail({
      to,
      subject,
      html,
      from: 'NPS-API <noreplay@nps-api.com>',
    })

    console.log('Message sended: ', message.messageId)
    console.log('Preview URL: ', nodemailer.getTestMessageUrl(message))
  }
}

export default new SendMailService()
