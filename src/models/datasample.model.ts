import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {hidden: ['sensor_hwid']},
})
export class Datasample extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
    mysql: {
        dataType: "float"
    }
  })
  value: number;

  @property({
    type: 'number',
    required: true,
  })
  datatype: number;

  @property({
    type: 'date',
    default: () => new Date()
  })
  timestamp: string;

  @property({
    type: 'string',
  })
  sensor_hwid?: string;

  constructor(data?: Partial<Datasample>) {
    super(data);
  }
}

export interface DatasampleRelations {
  // describe navigational properties here
}

export type DatasampleWithRelations = Datasample & DatasampleRelations;
