'use client'

import { Edit } from '@refinedev/mui'
import { useForm } from '@refinedev/react-hook-form'
import PostForm from '@components/PostForm/PostForm'

export default function PostEdit() {
  const {
    saveButtonProps,
    register,
    formState,
    control,
    refineCore: { formLoading, onFinish },
  } = useForm({})

  return (
    <>
      <Edit
        isLoading={formLoading}
        saveButtonProps={saveButtonProps}
        headerProps={{
          sx: {
            borderBottom: '1px solid',
          },
        }}
      >
        <PostForm register={register} formState={formState} control={control} />
      </Edit>
    </>
  )
}
