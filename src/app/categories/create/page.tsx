'use client'

import { Create } from '@refinedev/mui'
import { useForm } from '@refinedev/react-hook-form'
import CategoryForm from '@components/CategoryForm/CategoryForm'

export default function CategoryCreate() {
  const { saveButtonProps, register, formState } = useForm({})

  return (
    <>
      <Create
        saveButtonProps={saveButtonProps}
        headerProps={{
          sx: {
            borderBottom: '1px solid',
          },
        }}
      >
        <CategoryForm register={register} formState={formState} />
      </Create>
    </>
  )
}
