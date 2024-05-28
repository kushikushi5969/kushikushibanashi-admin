import { Box, TextField } from '@mui/material'
import { useForm } from '@refinedev/react-hook-form'
import { useTranslation } from '@refinedev/core'

export default function CategoryForm({
  register,
  formState,
}: {
  register: ReturnType<typeof useForm>['register']
  formState: ReturnType<typeof useForm>['formState']
}) {
  const { translate } = useTranslation()
  const { errors } = formState

  return (
    <Box component='form' sx={{ display: 'flex', flexDirection: 'column' }} autoComplete='off'>
      <TextField
        {...register('categoryName', {
          required: { value: true, message: translate('validation.required') },
          maxLength: { value: 50, message: translate('validation.maxLength', { max: 50 }) },
        })}
        error={!!(errors as any)?.categoryName}
        helperText={(errors as any)?.categoryName?.message}
        margin='normal'
        fullWidth
        InputLabelProps={{ shrink: true }}
        type='text'
        label={translate('categories.fields.name')}
        name='categoryName'
      />
    </Box>
  )
}
