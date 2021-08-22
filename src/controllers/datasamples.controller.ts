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
import {Datasample} from '../models';
import {DatasampleRepository} from '../repositories';

export class DatasamplesController {
  constructor(
    @repository(DatasampleRepository)
    public datasampleRepository : DatasampleRepository,
  ) {}

  /*
  @post('/datasamples')
  @response(200, {
    description: 'Datasample model instance',
    content: {'application/json': {schema: getModelSchemaRef(Datasample)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: getModelSchemaRef(Datasample, {
                title: 'NewDatasample',
                exclude: ['id'],
            }),
          },
        },
      },
    })
    datasample: [Omit<Datasample, 'id'>],
  ): Promise<Datasample[]> {
    return this.datasampleRepository.createAll(datasample);
  }

  @get('/datasamples/count')
  @response(200, {
    description: 'Datasample model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Datasample) where?: Where<Datasample>,
  ): Promise<Count> {
    return this.datasampleRepository.count(where);
  }
*/
  @get('/datasamples')
  @response(200, {
    description: 'Array of Datasample model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Datasample, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Datasample) filter?: Filter<Datasample>,
  ): Promise<Datasample[]> {
    return this.datasampleRepository.find(filter);
  }

  /*
  @patch('/datasamples')
  @response(200, {
    description: 'Datasample PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Datasample, {partial: true}),
        },
      },
    })
    datasample: Datasample,
    @param.where(Datasample) where?: Where<Datasample>,
  ): Promise<Count> {
    return this.datasampleRepository.updateAll(datasample, where);
  }

  
  @get('/datasamples/{id}')
  @response(200, {
    description: 'Datasample model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Datasample, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Datasample, {exclude: 'where'}) filter?: FilterExcludingWhere<Datasample>
  ): Promise<Datasample> {
    return this.datasampleRepository.findById(id, filter);
  }

  @patch('/datasamples/{id}')
  @response(204, {
    description: 'Datasample PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Datasample, {partial: true}),
        },
      },
    })
    datasample: Datasample,
  ): Promise<void> {
    await this.datasampleRepository.updateById(id, datasample);
  }

  @put('/datasamples/{id}')
  @response(204, {
    description: 'Datasample PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() datasample: Datasample,
  ): Promise<void> {
    await this.datasampleRepository.replaceById(id, datasample);
  }

  @del('/datasamples/{id}')
  @response(204, {
    description: 'Datasample DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.datasampleRepository.deleteById(id);
  }
  */
}
