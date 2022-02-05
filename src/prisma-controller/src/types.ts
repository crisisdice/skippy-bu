type Data<C> = { data: C }

type Where<U> = { where: U }

type WhereData<U, D> = Where<U> & Data<D>

type Create<C, R> = (args: Data<C>) => Promise<R>

type Locate<U, R> = (args: Where<U>) => Promise<R | null>

type Search<S, R> = (args: Where<S>) => Promise<R[]>

type Update<U, D, R> = (args: WhereData<U, D>) => Promise<R>

type Delete<U, R> = (args: Where<U>) => Promise<R>

export type DelegateType<C, D, U, S, R> = {
  create: Create<C, R>
  findFirst: Locate<U, R>
  findMany: Search<S, R>
  update: Update<U, D, R>
  delete: Delete<U, R>
}

