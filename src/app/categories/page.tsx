'use client'

import { DataGrid, GridColDef, getGridStringOperators, GridToolbar } from '@mui/x-data-grid'
import { deDE, enUS, jaJP } from '@mui/x-data-grid/locales'
import { Localization } from '@mui/x-data-grid/utils/getGridLocalization'
import { useTranslation } from '@refinedev/core'
import { DeleteButton, EditButton, List, ShowButton, useDataGrid } from '@refinedev/mui'
import React from 'react'

export default function CategoriesList() {
  const { dataGridProps } = useDataGrid()
  const { translate, getLocale } = useTranslation()

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: 'id',
        headerName: translate('categories.fields.id'),
        type: 'number',
        minWidth: 50,
        filterable: false,
        sortable: false,
      },
      {
        field: 'name',
        flex: 1,
        headerName: translate('categories.fields.name'),
        minWidth: 200,
        sortable: false,
        filterOperators: getGridStringOperators().filter((operator) => operator.value === 'contains'),
      },
      {
        field: 'created_at',
        headerName: translate('categories.fields.createdAt'),
        type: 'date',
        minWidth: 150,
        filterable: false,
        valueGetter: (params) => {
          const date = params.value ? new Date(params.value) : null
          return date && !isNaN(date.getTime()) ? date : null
        },
      },
      {
        field: 'updated_at',
        headerName: translate('categories.fields.updatedAt'),
        type: 'date',
        minWidth: 150,
        filterable: false,
        valueGetter: (params) => {
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
        renderCell: function render({ row }) {
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
    [translate]
  )

  const localeMap: { [key: string]: Localization } = {
    en: enUS,
    ja: jaJP,
    de: deDE,
  }
  const currentLocale = getLocale() || 'ja'
  const language = localeMap[currentLocale]

  return (
    <List>
      <DataGrid
        {...dataGridProps}
        columns={columns}
        localeText={language.components.MuiDataGrid.defaultProps.localeText}
        slots={{ toolbar: GridToolbar }}
        autoHeight
      />
    </List>
  )
}
