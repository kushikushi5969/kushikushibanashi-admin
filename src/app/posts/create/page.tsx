'use client'

import { Create } from '@refinedev/mui'
import { useForm } from '@refinedev/react-hook-form'
import PostForm from '@components/PostForm/PostForm'

export default function PostCreate() {
  const {
    saveButtonProps,
    register,
    formState,
    control,
    refineCore: { formLoading, onFinish },
  } = useForm({})

  return (
    <>
      <Create
        isLoading={formLoading}
        saveButtonProps={saveButtonProps}
        headerProps={{
          sx: {
            borderBottom: '1px solid',
          },
        }}
      >
        <PostForm register={register} formState={formState} control={control} />
      </Create>
    </>
  )
}
