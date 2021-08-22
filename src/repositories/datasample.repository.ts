import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MariadbDataSource} from '../datasources';
import {Datasample, DatasampleRelations} from '../models';

export class DatasampleRepository extends DefaultCrudRepository<
  Datasample,
  typeof Datasample.prototype.id,
  DatasampleRelations
> {
  constructor(
    @inject('datasources.mariadb') dataSource: MariadbDataSource,
  ) {
    super(Datasample, dataSource);
  }
}
