import { EntityRepository, Repository } from 'typeorm'
import Survey from '../models/SurveyModel'

@EntityRepository(Survey)
class SurveysRepository extends Repository<Survey> {}

export default SurveysRepository
