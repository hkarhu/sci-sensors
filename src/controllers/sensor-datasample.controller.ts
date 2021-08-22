import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Sensor,
  Datasample,
} from '../models';
import {SensorRepository} from '../repositories';

export class SensorDatasampleController {
  constructor(
    @repository(SensorRepository) protected sensorRepository: SensorRepository,
  ) { }

  @get('/sensors/{id}/datasamples', {
    responses: {
      '200': {
        description: 'Array of Sensor has many Datasample',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Datasample)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Datasample>,
  ): Promise<Datasample[]> {
    return this.sensorRepository.datasamples(id).find(filter);
  }

  @post('/sensors/{id}/datasamples', {
    responses: {
      '200': {
        description: 'Sensor model instance',
        content: {'application/json': {schema: getModelSchemaRef(Datasample)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Sensor.prototype.hwid,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Datasample, {
            title: 'NewDatasampleInSensor',
            exclude: ['id'],
            optional: ['sensor_hwid']
          }),
        },
      },
    }) datasample: Omit<Datasample, 'id'>,
  ): Promise<Datasample> {
    return this.sensorRepository.datasamples(id).create(datasample);
  }

  /*
  @patch('/sensors/{id}/datasamples', {
    responses: {
      '200': {
        description: 'Sensor.Datasample PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Datasample, {partial: true}),
        },
      },
    })
    datasample: Partial<Datasample>,
    @param.query.object('where', getWhereSchemaFor(Datasample)) where?: Where<Datasample>,
  ): Promise<Count> {
    return this.sensorRepository.datasamples(id).patch(datasample, where);
  }

  @del('/sensors/{id}/datasamples', {
    responses: {
      '200': {
        description: 'Sensor.Datasample DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Datasample)) where?: Where<Datasample>,
  ): Promise<Count> {
    return this.sensorRepository.datasamples(id).delete(where);
  }
  */
}
