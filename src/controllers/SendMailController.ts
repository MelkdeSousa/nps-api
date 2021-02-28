import { Request, Response } from 'express'
import { resolve } from 'path'
import { getCustomRepository } from 'typeorm'
import SurveysRepository from '../repositories/SurveyRepository'
import SurveysUsersRepository from '../repositories/SurveyUserRepository'
import UsersRepository from '../repositories/UserRepository'
import SendMailService from '../services/SendMailService'

class SendMailController {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body

    const usersRepository = getCustomRepository(UsersRepository)
    const surveysRepository = getCustomRepository(SurveysRepository)
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

    const user = await usersRepository.findOne({ email })
    const survey = await surveysRepository.findOne({
      id: survey_id,
    })

    if (!user) {
      return response.status(404).json({ error: 'User does not exist' })
    }

    if (!survey) {
      return response.status(404).json({ error: 'Survey does not exist' })
    }

    const surveyPath = resolve(__dirname, '..', 'views', 'email', 'survey.hbs')
    const context = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      user_id: user.id,
      endpoint: process.env.ENDPOINT_MAIL,
    }

    const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
      where: [{ user_id: user.id }, { value: null }],
      relations: ['user', 'survey'],
    })

    if (surveyUserAlreadyExists) {
      await SendMailService.execute(email, survey.title, surveyPath, context)
      return response.status(200).json(surveyUserAlreadyExists)
    }

    const surveyUser = surveysUsersRepository.create({
      user_id: user.id,
      survey_id: survey.id,
    })

    await surveysUsersRepository.save(surveyUser)

    await SendMailService.execute(email, survey.title, surveyPath, context)

    return response.status(201).json(surveyUser)
  }
}

export default SendMailController
