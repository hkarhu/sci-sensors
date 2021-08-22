import {Entity, model, property, hasMany} from '@loopback/repository';
import {Datasample} from './datasample.model';

@model()
export class Sensor extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  hwid: string;

  @property({
    type: 'string',
    default: "Untitled sensor",
  })
  friendly_name?: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  location_tags?: string[];

  @hasMany(() => Datasample, {keyTo: 'sensor_hwid'})
  datasamples: Datasample[];

  constructor(data?: Partial<Sensor>) {
    super(data);
  }
}

export interface SensorRelations {
  // describe navigational properties here
}

export type SensorWithRelations = Sensor & SensorRelations;
