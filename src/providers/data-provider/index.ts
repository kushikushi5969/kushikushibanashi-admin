import { CrudFilters, CrudOperators, CrudSorting, DataProvider, HttpError, Pagination } from '@refinedev/core'
import axios, { AxiosInstance } from 'axios'

const apiUrl = process.env.NEXT_PUBLIC_API_URL
const axiosInstance: AxiosInstance = axios.create({
  baseURL: apiUrl,
})

export const dataProvider: DataProvider = {
  getApiUrl: () => apiUrl as string,

  getList: async ({ resource, pagination, sorters, filters, meta }) => {
    const { headers: headersFromMeta } = meta ?? {}
    // init query object for pagination and sorting
    const query: {
      _start?: number
      _end?: number
      _sort?: string
      _order?: string
    } = {}
    const generatedPagination = generatePagination(pagination)
    if (generatedPagination) {
      const { _start, _end } = generatedPagination
      query._start = _start
      query._end = _end
    }
    const generatedSort = generateSort(sorters)
    if (generatedSort) {
      const { _sort, _order } = generatedSort
      query._sort = _sort.join(',')
      query._order = _order.join(',')
    }
    const queryFilters = generateFilter(filters)
    const result = await axiosInstance.get(resource, {
      params: { ...query, ...queryFilters },
      headers: headersFromMeta,
    })

    // data { data: [], total: number }
    return result.data
  },

  getOne: async ({ resource, id, meta }) => {
    const { headers: headersFromMeta } = meta ?? {}
    const data = await axiosInstance.get(`${resource}/${id}`, {
      headers: headersFromMeta,
    })
    return data
  },

  create: async ({ resource, variables, meta }) => {
    const { headers: headersFromMeta } = meta ?? {}
    const data = await axiosInstance.post(resource, variables, {
      headers: headersFromMeta,
    })
    return data
  },

  update: async ({ resource, id, variables, meta }) => {
    const { headers: headersFromMeta } = meta ?? {}
    const data = await axiosInstance.put(`${resource}/${id}`, variables, {
      headers: headersFromMeta,
    })
    return data
  },

  deleteOne: async ({ resource, id, variables, meta }) => {
    const { headers: headersFromMeta } = meta ?? {}
    const data = await axiosInstance.delete(`${resource}/${id}`, {
      headers: headersFromMeta,
    })
    return data
  },

  getMany: async ({ resource, ids, meta }) => {
    const { headers: headersFromMeta } = meta ?? {}
    const foundData = ids.map((id) => axiosInstance.get(`${resource}/${id}`, { headers: headersFromMeta }))
    const results = await Promise.all(foundData)
    return { data: results.map((result) => result.data) }
  },
}

// Convert axios errors to HttpError on every response.
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const customError: HttpError = {
      ...error,
      message: error.response?.data?.message,
      statusCode: error.response?.status,
    }
    return Promise.reject(customError)
  }
)

// convert Refine CrudOperators to the format that API accepts.
const mapOperator = (operator: CrudOperators): string => {
  switch (operator) {
    case 'ne':
    case 'gte':
    case 'lte':
      return `_${operator}`
    case 'contains':
      return '_like'
    case 'eq':
    default:
      return ''
  }
}

// generate query string from Refine CrudFilters to the format that API accepts.
const generateFilter = (filters?: CrudFilters) => {
  const queryFilters: { [key: string]: string } = {}

  if (filters) {
    filters.map((filter) => {
      if (filter.operator === 'or' || filter.operator === 'and') {
        throw new Error(`[@refinedev/simple-rest]: /docs/data/data-provider#creating-a-data-provider`)
      }

      if ('field' in filter) {
        const { field, operator, value } = filter

        if (field === 'q') {
          queryFilters[field] = value
          return
        }

        const mappedOperator = mapOperator(operator)
        queryFilters[`${field}${mappedOperator}`] = value
      }
    })
  }

  return queryFilters
}

// generate query string from Refine CrudSorting to the format that API accepts.
const generateSort = (sorters?: CrudSorting) => {
  if (sorters && sorters.length > 0) {
    const _sort: string[] = []
    const _order: string[] = []

    sorters.map((item) => {
      _sort.push(item.field)
      _order.push(item.order)
    })

    return {
      _sort,
      _order,
    }
  }

  return
}

// generate query string from Refine Pagination to the format that API accepts.
const generatePagination = (pagination?: Pagination) => {
  // pagination is optional on data hooks, so we need to set default values.
  const { current = 1, pageSize = 10, mode = 'server' } = pagination ?? {}

  const query: {
    _start?: number
    _end?: number
  } = {}

  if (mode === 'server') {
    query._start = (current - 1) * pageSize
    query._end = current * pageSize
  }

  return query
}
