'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Autocomplete, Box, TextField, Typography } from '@mui/material'
import { useForm } from '@refinedev/react-hook-form'
import { useTranslation } from '@refinedev/core'
import { useAutocomplete } from '@refinedev/mui'
import { Controller } from 'react-hook-form'

const CustomCKEditor = dynamic(
  () => {
    return import('@components/CustomCKEditor/CustomCKEditor')
  },
  { ssr: false }
)

export default function PostForm({
  register,
  formState,
  control,
}: {
  register: ReturnType<typeof useForm>['register']
  formState: ReturnType<typeof useForm>['formState']
  control: ReturnType<typeof useForm>['control']
}) {
  const { translate, getLocale } = useTranslation()
  const { errors } = formState
  const currentLocale = getLocale() || 'ja'
  const [isEditorError, setIsEditorError] = useState(false)

  // カテゴリーの取得 Promise の結果を格納する変数
  const { autocompleteProps: categoryAutocompleteProps } = useAutocomplete({
    resource: 'categories',
  })

  useEffect(() => {
    setIsEditorError(!!errors.content)
  }, [errors.content])

  return (
    <Box component='form' sx={{ display: 'flex', flexDirection: 'column' }} autoComplete='off'>
      <Typography variant='body1' fontWeight='bold' mt={2}>
        {translate('posts.fields.title')}
      </Typography>
      <TextField
        {...register('title', {
          required: { value: true, message: translate('validation.required') },
          maxLength: { value: 50, message: translate('validation.maxLength', { max: 200 }) },
        })}
        error={!!(errors as any)?.title}
        helperText={(errors as any)?.title?.message}
        margin='normal'
        fullWidth
        InputLabelProps={{ shrink: true }}
        type='text'
        label={translate('posts.fields.title')}
        name='title'
      />
      <Typography variant='body1' fontWeight='bold' mt={2} mb={2}>
        {translate('posts.fields.content')}
      </Typography>
      <Controller
        name='content'
        control={control}
        rules={{
          required: { value: true, message: translate('validation.required') },
          validate: (value) => value !== null || translate('validation.required'),
        }}
        render={({ field: { onChange, value } }) => (
          <CustomCKEditor
            initialData={value}
            currentLocale={currentLocale}
            onChange={onChange}
            isError={isEditorError}
          />
        )}
      />
      {errors.content && (
        <Typography fontSize={12} color='error' marginTop='3px' marginLeft='14px'>
          {translate('validation.required')}
        </Typography>
      )}
      <Typography variant='body1' fontWeight='bold' mt={2}>
        {translate('posts.fields.category')}
      </Typography>
      <Controller
        control={control}
        name={'categoryId'}
        rules={{
          required: { value: true, message: translate('validation.required') },
          validate: (value) => value !== null || translate('validation.required'),
        }}
        defaultValue={null as any}
        render={({ field }) => (
          <Autocomplete
            {...categoryAutocompleteProps}
            {...field}
            onChange={(_, value) => {
              if (value === null) {
                field.onChange(null)
                return
              }
              field.onChange(value.id)
            }}
            getOptionLabel={(item) => {
              return (
                categoryAutocompleteProps?.options?.find((p) => {
                  const itemId = typeof item === 'object' ? item?.id?.toString() : item?.toString()
                  const pId = p?.id?.toString()
                  return itemId === pId
                })?.name ?? ''
              )
            }}
            isOptionEqualToValue={(option, value) => {
              const optionId = option?.id?.toString()
              const valueId = typeof value === 'object' ? value?.id?.toString() : value?.toString()
              return value === undefined || optionId === valueId
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={translate('posts.fields.category')}
                margin='normal'
                variant='outlined'
                error={!!(errors as any)?.category?.id}
                helperText={(errors as any)?.category?.id?.message}
              />
            )}
          />
        )}
      />
    </Box>
  )
}
