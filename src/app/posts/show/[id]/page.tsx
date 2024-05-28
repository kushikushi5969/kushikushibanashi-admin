'use client'

import { Box, Grid, Typography } from '@mui/material'
import { useOne, useTranslation } from '@refinedev/core'
import { Show, TextFieldComponent as TextField } from '@refinedev/mui'
import parse from 'html-react-parser'
import './postContent.css'

export default function PostShow({ params }: { params: { id: string } }) {
  const { translate } = useTranslation()
  const { data: postData, isLoading } = useOne({
    resource: 'posts',
    id: params.id,
  })
  const postRecord = postData?.data

  const { data: categoryData } = useOne({
    resource: 'categories',
    id: postRecord?.categoryId,
  })
  const categoryRecord = categoryData?.data || {}

  const { data: thumbnailData } = useOne({
    resource: 'media',
    id: postRecord?.thumbnailId,
  })
  const thumbnailRecord = thumbnailData?.data || {}

  return (
    <Show
      isLoading={isLoading}
      headerProps={{
        sx: {
          borderBottom: '1px solid',
        },
      }}
    >
      <Grid container spacing={2} mt={1} pl={2}>
        <Grid xs={6}>
          <Typography variant='body1' fontWeight='bold'>
            {translate('posts.fields.title')}
          </Typography>
          <TextField value={postRecord?.title} variant='h4' mt={1} />
        </Grid>
        <Grid xs={3}>
          <Typography variant='body1' fontWeight='bold'>
            {translate('posts.fields.category')}
          </Typography>
          <TextField value={categoryRecord?.categoryName} variant='body1' mt={1} />
        </Grid>
        <Grid xs={3}>
          <Typography variant='body1' fontWeight='bold'>
            {translate('posts.fields.thumbnail')}
          </Typography>
          <Box mt={1}>
            <img src={thumbnailRecord?.mediaUrl} alt={'サムネイル'} />
          </Box>
        </Grid>
        <Grid xs={12}>
          <Typography variant='body1' fontWeight='bold' mb={1}>
            {translate('posts.fields.content')}
          </Typography>
          <div className='post-content ck ck-content'>{parse(postRecord?.content || '')}</div>
        </Grid>
      </Grid>
    </Show>
  )
}
