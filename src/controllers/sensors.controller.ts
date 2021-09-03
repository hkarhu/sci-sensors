import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Sensor} from '../models';
import {SensorRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';

export class SensorsController {
  constructor(
    @repository(SensorRepository)
    public sensorRepository : SensorRepository,
  ) {}

//  @authenticate('jwt') 
  @authenticate.skip()
  @post('/sensors')
  @response(200, {
    description: 'Sensor model instance',
    content: {'application/json': {schema: getModelSchemaRef(Sensor)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Sensor, {
            title: 'NewSensor',
            
          }),
        },
      },
    })
    sensor: Sensor,
  ): Promise<Sensor> {
    return this.sensorRepository.create(sensor);
  }

  @authenticate.skip()
  @get('/sensors/count')
  @response(200, {
    description: 'Sensor model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Sensor) where?: Where<Sensor>,
  ): Promise<Count> {
    return this.sensorRepository.count(where);
  }

  @authenticate.skip()
  @get('/sensors')
  @response(200, {
    description: 'Array of Sensor model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Sensor, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Sensor) filter?: Filter<Sensor>,
  ): Promise<Sensor[]> {
    return this.sensorRepository.find(filter);
  }

  @authenticate.skip()
//@authenticate('jwt') 
  @patch('/sensors')
  @response(200, {
    description: 'Sensor PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Sensor, {partial: true}),
        },
      },
    })
    sensor: Sensor,
    @param.where(Sensor) where?: Where<Sensor>,
  ): Promise<Count> {
    return this.sensorRepository.updateAll(sensor, where);
  }

  @get('/sensors/{id}')
  @response(200, {
    description: 'Sensor model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Sensor, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Sensor, {exclude: 'where'}) filter?: FilterExcludingWhere<Sensor>
  ): Promise<Sensor> {
    return this.sensorRepository.findById(id, filter);
  }

  @authenticate('jwt') 
  @patch('/sensors/{id}')
  @response(204, {
    description: 'Sensor PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Sensor, {partial: true}),
        },
      },
    })
    sensor: Sensor,
  ): Promise<void> {
    await this.sensorRepository.updateById(id, sensor);
  }

  @authenticate('jwt') 
  @put('/sensors/{id}')
  @response(204, {
    description: 'Sensor PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() sensor: Sensor,
  ): Promise<void> {
    await this.sensorRepository.replaceById(id, sensor);
  }

  @authenticate('jwt') 
  @del('/sensors/{id}')
  @response(204, {
    description: 'Sensor DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.sensorRepository.deleteById(id);
  }
}
