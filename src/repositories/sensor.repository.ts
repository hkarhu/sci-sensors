import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MariadbDataSource} from '../datasources';
import {Sensor, SensorRelations, Datasample} from '../models';
import {DatasampleRepository} from './datasample.repository';

export class SensorRepository extends DefaultCrudRepository<
  Sensor,
  typeof Sensor.prototype.hwid,
  SensorRelations
> {

  public readonly datasamples: HasManyRepositoryFactory<Datasample, typeof Sensor.prototype.hwid>;

  constructor(
    @inject('datasources.mariadb') dataSource: MariadbDataSource, @repository.getter('DatasampleRepository') protected datasampleRepositoryGetter: Getter<DatasampleRepository>,
  ) {
    super(Sensor, dataSource);
    this.datasamples = this.createHasManyRepositoryFactoryFor('datasamples', datasampleRepositoryGetter,);
    this.registerInclusionResolver('datasamples', this.datasamples.inclusionResolver);
  }
}
