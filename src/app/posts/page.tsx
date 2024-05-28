'use client'

import React from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import { deDE, enUS, jaJP } from '@mui/x-data-grid/locales'
import {
  DataGrid,
  GridColDef,
  getGridSingleSelectOperators,
  getGridStringOperators,
  GridRenderCellParams,
  GridToolbar,
  GridValueGetterParams,
} from '@mui/x-data-grid'
import { Localization } from '@mui/x-data-grid/utils/getGridLocalization'
import { useMany, useTranslation } from '@refinedev/core'
import { DeleteButton, EditButton, List, ShowButton, useDataGrid } from '@refinedev/mui'

interface SelectCategory {
  value: string
  label: string
}

export default function PostsList() {
  const { dataGridProps } = useDataGrid({})
  const { translate, getLocale } = useTranslation()

  const { data: mediaData, isLoading: mediaIsLoading } = useMany({
    resource: 'media',
    ids: dataGridProps?.rows?.map((item: any) => item?.thumbnail_id) ?? [],
  })

  const selectCategories: SelectCategory[] =
    dataGridProps?.rows?.map((item) => ({
      value: String(item?.category?.id),
      label: item?.category?.name,
    })) ?? []
  const selectCategoriesList = selectCategories.filter(
    (category, index, self) => self.findIndex((t) => t.value === category.value) === index
  )

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: 'id',
        headerName: translate('posts.fields.id'),
        type: 'number',
        minWidth: 50,
        filterable: false,
        sortable: false,
      },
      {
        field: 'title',
        flex: 1,
        headerName: translate('posts.fields.title'),
        minWidth: 200,
        sortable: false,
        filterOperators: getGridStringOperators().filter((operator) => operator.value === 'contains'),
      },
      {
        field: 'thumbnail_id',
        headerName: translate('posts.fields.thumbnail'),
        minWidth: 250,
        sortable: false,
        filterable: false,
        headerAlign: 'center',
        renderCell: (params: GridRenderCellParams) => {
          const thumbnail_id = params.row.thumbnail_id
          const thumbnail_url = mediaData?.data.find((item: any) => item.mediaId === thumbnail_id)?.mediaUrl
          return (
            <>
              {mediaIsLoading || !thumbnail_url ? (
                <div className='grid place-items-center'>
                  <CircularProgress />
                </div>
              ) : (
                <img src={thumbnail_url} alt='thumbnail' height='auto' />
              )}
            </>
          )
        },
      },
      {
        field: 'category',
        headerName: translate('posts.fields.category'),
        minWidth: 150,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
        renderCell(params: GridRenderCellParams) {
          return params.row.category?.name ?? null
        },
        filterOperators: getGridSingleSelectOperators().filter((operator) => operator.value === 'is'),
        type: 'singleSelect',
        valueOptions: selectCategoriesList,
      },
      {
        field: 'created_at',
        headerName: translate('table.createdAt'),
        type: 'date',
        minWidth: 100,
        filterable: false,
        valueGetter: (params: GridValueGetterParams) => {
          const date = params.value ? new Date(params.value) : null
          return date && !isNaN(date.getTime()) ? date : null
        },
      },
      {
        field: 'updated_at',
        headerName: translate('table.updatedAt'),
        type: 'date',
        minWidth: 100,
        filterable: false,
        valueGetter: (params: GridValueGetterParams) => {
          const date = params.value ? new Date(params.value) : null
          return date && !isNaN(date.getTime()) ? date : null
        },
      },
      {
        field: 'actions',
        headerName: translate('table.actions'),
        sortable: false,
        filterable: false,
        hideable: false,
        disableColumnMenu: true,
        renderCell: function render({ row }: GridRenderCellParams) {
          return (
            <>
              <EditButton hideText recordItemId={row.id} />
              <ShowButton hideText recordItemId={row.id} />
              <DeleteButton hideText recordItemId={row.id} />
            </>
          )
        },
        align: 'center',
        headerAlign: 'center',
        minWidth: 200,
      },
    ],
    [mediaData, mediaIsLoading, translate]
  )

  const localeMap: { [key: string]: Localization } = {
    en: enUS,
    ja: jaJP,
    de: deDE,
  }
  const currentLocale = getLocale() || 'ja'
  const language = localeMap[currentLocale]

  return (
    <List canCreate>
      <DataGrid
        {...dataGridProps}
        columns={columns}
        localeText={language.components.MuiDataGrid.defaultProps.localeText}
        slots={{ toolbar: GridToolbar }}
        autoHeight
        rowHeight={150}
        filterDebounceMs={700}
      />
    </List>
  )
}
