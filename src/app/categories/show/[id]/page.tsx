'use client'

import { IconButton, Stack, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useBack, useOne, useTranslation } from '@refinedev/core'
import { NumberField, Show, TextFieldComponent as TextField } from '@refinedev/mui'

const BackButton = () => {
  const goBack = useBack()
  return (
    <IconButton onClick={goBack} color='inherit'>
      <ArrowBackIcon />
    </IconButton>
  )
}

export default function CategoryShow({ params }: { params: { id: string } }) {
  const { translate } = useTranslation()
  const { data, isLoading } = useOne({
    resource: 'categories',
    id: params.id,
  })
  const record = data?.data

  return (
    <Show
      isLoading={isLoading}
      goBack={<BackButton />}
      headerProps={{
        sx: {
          borderBottom: '1px solid',
        },
      }}
    >
      <Stack gap={1}>
        <Typography variant='body1' fontWeight='bold'>
          {translate('categories.fields.id')}
        </Typography>
        <NumberField value={record?.categoryId ?? ''} />
        <Typography variant='body1' fontWeight='bold'>
          {translate('categories.fields.name')}
        </Typography>
        <TextField value={record?.categoryName} />
      </Stack>
    </Show>
  )
}
