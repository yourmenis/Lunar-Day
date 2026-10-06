// รูปแบบข้อมูลที่ได้จาก backend (ใช้แทน any)

// บทความ: GET /articles, /articles/search, /articles/<id>
export type ReferenceLink = { text: string; url?: string }
export type Article = {
  ArticleID: number
  Title: string
  ImageURL?: string | null
  Content?: string
  Link?: string | ReferenceLink[] | null
  Created_at?: string
}
// บล็อกเนื้อหาในบทความ (Content เป็น JSON array)
export type ContentBlock = { type: string; value?: string }

// โปรไฟล์: GET /profile/
export type Profile = {
  Username: string
  Name: string
  LastName: string
  Birthday: string | null
  Email?: string
  Profile_Image?: string | null
}

// ประวัติการวิเคราะห์: GET /history/, /analysis/result/<id>
export type HistoryItem = {
  AssessmentID: number
  Detect1?: string
  Detect2?: string
  Risk_Level?: string
  Potential_Disease?: string
  Recommendation?: string
  Confidence?: number | null
  Image_Path?: string | null
  Create_At?: string
}
