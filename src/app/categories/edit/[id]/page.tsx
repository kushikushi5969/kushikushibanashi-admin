'use client'

import { Edit } from '@refinedev/mui'
import { useForm } from '@refinedev/react-hook-form'
import CategoryForm from '@components/CategoryForm/CategoryForm'

export default function CategoryEdit() {
  const { saveButtonProps, register, formState } = useForm({})

  return (
    <>
      <Edit
        saveButtonProps={saveButtonProps}
        headerProps={{
          sx: {
            borderBottom: '1px solid',
          },
        }}
      >
        <CategoryForm register={register} formState={formState} />
      </Edit>
    </>
  )
}
