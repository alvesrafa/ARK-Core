<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Builder as EloquentQueryBuilder;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Pagination\AbstractPaginator as Paginator;

abstract class AbstractRepository
{
    protected string $modelClass;

    protected function newQuery(): EloquentQueryBuilder|QueryBuilder
    {
        return app($this->modelClass)->newQuery();
    }

    protected function newQueryWithoutGlobalScopes(): EloquentQueryBuilder|QueryBuilder
    {
        return app($this->modelClass)->newQuery()->withoutGlobalScopes();
    }

    /**
     * @param  array<string, mixed>  $params
     */
    public function create(array $params): Model
    {
        $data = $this->filterFillable($params);

        return app($this->modelClass)->create($data);
    }

    /**
     * @param  array<string, mixed>  $params
     */
    public function update(array $params, int $id): Model
    {
        $model = $this->newQuery()->findOrFail($id);

        $data = $this->filterFillable($params);
        $model->fill($data);
        $model->save();

        return $model;
    }

    public function findByID(int $id, bool $fail = true): ?Model
    {
        if ($fail) {
            return $this->newQuery()->findOrFail($id);
        }

        return $this->newQuery()->find($id);
    }

    public function deleteById(int $id): bool
    {
        return (bool) $this->newQuery()->where('id', $id)->delete();
    }

    /**
     * @return EloquentCollection<int, Model>|Paginator
     */
    protected function doQuery(EloquentQueryBuilder|QueryBuilder|null $query = null, int $take = 15, bool $paginate = true): EloquentCollection|Paginator
    {
        if (is_null($query)) {
            $query = $this->newQuery();
        }

        if ($paginate) {
            return $query->paginate($take);
        }

        if ($take > 0) {
            $query->take($take);
        }

        return $query->get();
    }

    /**
     * @param  array<string, mixed>  $params
     * @return EloquentCollection<int, Model>|Paginator|int
     */
    public function getByParams(array $params = [], bool $count = false): EloquentCollection|Paginator|int
    {
        $query = $this->newQuery();

        if (isset($params['where'])) {
            foreach ($params['where'] as $key => $value) {
                is_null($value)
                    ? $query->whereNull($key)
                    : $query->where($key, $value);
            }
        }

        if (isset($params['query_with'])) {
            $query->with($params['query_with']);
        }

        if (isset($params['query_wherehas'])) {
            foreach ($params['query_wherehas'] as $whereHas) {
                $query->whereHas($whereHas);
            }
        }

        if (isset($params['order_asc'])) {
            $query->orderBy($params['order_asc']);
        }

        if (isset($params['order_desc'])) {
            $query->orderByDesc($params['order_desc']);
        }

        if (isset($params['limit'])) {
            $query->limit($params['limit']);
        }

        return $count
            ? $query->count()
            : $this->doQuery($query, 0, false);
    }

    /**
     * @return EloquentCollection<int, Model>|Paginator
     */
    public function getAll(int $take = 0, bool $paginate = false): EloquentCollection|Paginator
    {
        return $this->doQuery(null, $take, $paginate);
    }

    /**
     * @param  array<string, mixed>  $params
     * @return array<string, mixed>
     */
    private function filterFillable(array $params): array
    {
        $fillable = app($this->modelClass)->getFillable();

        return array_intersect_key($params, array_flip($fillable));
    }
}
