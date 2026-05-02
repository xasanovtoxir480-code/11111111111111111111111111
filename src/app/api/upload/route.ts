import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest()
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Ruxsat berilmagan' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const type = formData.get('type') as string || 'anime' // anime, cover, episode

    if (!file) {
      return NextResponse.json({ error: 'Fayl topilmadi' }, { status: 400 })
    }

    // Validate file type
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo']

    const isImage = allowedImageTypes.includes(file.type)
    const isVideo = allowedVideoTypes.includes(file.type)

    if (!isImage && !isVideo) {
      return NextResponse.json({ error: 'Fayl formati qabul qilinmaydi. Ruxsat etilgan: JPG, PNG, WebP, GIF, MP4, WebM' }, { status: 400 })
    }

    // Validate file size (100MB max)
    const maxSize = 100 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Fayl hajmi 100MB dan oshmasligi kerak' }, { status: 400 })
    }

    // Generate unique filename
    const ext = path.extname(file.name) || (isImage ? '.jpg' : '.mp4')
    const uniqueName = `${crypto.randomUUID()}${ext}`

    // Determine subdirectory
    let subdir: string
    if (type === 'cover') {
      subdir = 'covers'
    } else if (type === 'episode') {
      subdir = 'episodes'
    } else {
      subdir = 'anime'
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', subdir)

    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true })

    // Write file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath = path.join(uploadDir, uniqueName)
    await writeFile(filePath, buffer)

    // Return the public URL path
    const publicPath = `/uploads/${subdir}/${uniqueName}`

    return NextResponse.json({
      url: publicPath,
      filename: uniqueName,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Fayl yuklashda xatolik yuz berdi' }, { status: 500 })
  }
}
