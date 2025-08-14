import { useState, useEffect } from 'react'
import { BookOpen, RefreshCw, AlertCircle } from 'lucide-react'

interface BibleVerse {
  verse: string
  reference: string
  translation: string
  book?: string
  chapter?: number
  verse_number?: number
}

const BibleVerse = () => {
  const [verse, setVerse] = useState<BibleVerse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fallback verses in case API fails
  const fallbackVerses: BibleVerse[] = [
    {
      verse: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
      reference: "Jeremiah 29:11",
      translation: "NIV"
    },
    {
      verse: "I can do all things through Christ who strengthens me.",
      reference: "Philippians 4:13",
      translation: "NKJV"
    },
    {
      verse: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
      reference: "Proverbs 3:5-6",
      translation: "NIV"
    }
  ]

  // Popular verses from all 66 books for daily rotation
  const dailyVerses: BibleVerse[] = [
    // Old Testament - Law (5 books)
    { verse: "In the beginning God created the heavens and the earth.", reference: "Genesis 1:1", translation: "NIV" },
    { verse: "You shall have no other gods before me.", reference: "Exodus 20:3", translation: "NIV" },
    { verse: "The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you.", reference: "Numbers 6:24-25", translation: "NIV" },
    { verse: "Hear, O Israel: The Lord our God, the Lord is one.", reference: "Deuteronomy 6:4", translation: "NIV" },
    
    // Old Testament - Historical Books (12 books)
    { verse: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.", reference: "Joshua 1:9", translation: "NIV" },
    { verse: "In those days Israel had no king; everyone did as they saw fit.", reference: "Judges 21:25", translation: "NIV" },
    { verse: "Where you go I will go, and where you stay I will stay. Your people will be my people and your God my God.", reference: "Ruth 1:16", translation: "NIV" },
    { verse: "The Lord does not look at the things people look at. People look at the outward appearance, but the Lord looks at the heart.", reference: "1 Samuel 16:7", translation: "NIV" },
    { verse: "Your love, Lord, reaches to the heavens, your faithfulness to the skies.", reference: "Psalm 36:5", translation: "NIV" },
    { verse: "Trust in the Lord with all your heart and lean not on your own understanding.", reference: "Proverbs 3:5", translation: "NIV" },
    { verse: "There is a time for everything, and a season for every activity under the heavens.", reference: "Ecclesiastes 3:1", translation: "NIV" },
    { verse: "I am my beloved's and my beloved is mine.", reference: "Song of Songs 6:3", translation: "NIV" },
    
    // Old Testament - Major Prophets (5 books)
    { verse: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.", reference: "Jeremiah 29:11", translation: "NIV" },
    { verse: "The Lord is my portion, says my soul, therefore I will hope in him.", reference: "Lamentations 3:24", translation: "NIV" },
    { verse: "I will give you a new heart and put a new spirit in you.", reference: "Ezekiel 36:26", translation: "NIV" },
    { verse: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles.", reference: "Isaiah 40:31", translation: "NIV" },
    { verse: "The Lord is good to those whose hope is in him, to the one who seeks him.", reference: "Daniel 9:4", translation: "NIV" },
    
    // Old Testament - Minor Prophets (12 books)
    { verse: "The Lord is slow to anger but great in power.", reference: "Nahum 1:3", translation: "NIV" },
    { verse: "But let justice roll on like a river, righteousness like a never-failing stream!", reference: "Amos 5:24", translation: "NIV" },
    { verse: "He has shown you, O mortal, what is good. And what does the Lord require of you? To act justly and to love mercy and to walk humbly with your God.", reference: "Micah 6:8", translation: "NIV" },
    { verse: "The Lord your God is with you, the Mighty Warrior who saves.", reference: "Zephaniah 3:17", translation: "NIV" },
    { verse: "Not by might nor by power, but by my Spirit, says the Lord Almighty.", reference: "Zechariah 4:6", translation: "NIV" },
    { verse: "See, I will send the prophet Elijah to you before that great and dreadful day of the Lord comes.", reference: "Malachi 4:5", translation: "NIV" },
    
    // New Testament - Gospels (4 books)
    { verse: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.", reference: "John 3:16", translation: "NIV" },
    { verse: "Come to me, all you who are weary and burdened, and I will give you rest.", reference: "Matthew 11:28", translation: "NIV" },
    { verse: "For even the Son of Man did not come to be served, but to serve, and to give his life as a ransom for many.", reference: "Mark 10:45", translation: "NIV" },
    { verse: "For the Son of Man came to seek and to save the lost.", reference: "Luke 19:10", translation: "NIV" },
    
    // New Testament - Acts & Epistles (22 books)
    { verse: "But you will receive power when the Holy Spirit comes on you; and you will be my witnesses.", reference: "Acts 1:8", translation: "NIV" },
    { verse: "I am not ashamed of the gospel, because it is the power of God that brings salvation to everyone who believes.", reference: "Romans 1:16", translation: "NIV" },
    { verse: "And we know that in all things God works for the good of those who love him.", reference: "Romans 8:28", translation: "NIV" },
    { verse: "For the wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord.", reference: "Romans 6:23", translation: "NIV" },
    { verse: "I can do all things through Christ who strengthens me.", reference: "Philippians 4:13", translation: "NIV" },
    { verse: "For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God.", reference: "Ephesians 2:8", translation: "NIV" },
    { verse: "But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness.", reference: "Galatians 5:22", translation: "NIV" },
    { verse: "Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!", reference: "2 Corinthians 5:17", translation: "NIV" },
    { verse: "But thanks be to God! He gives us the victory through our Lord Jesus Christ.", reference: "1 Corinthians 15:57", translation: "NIV" },
    { verse: "For God has not given us a spirit of fear, but of power and of love and of a sound mind.", reference: "2 Timothy 1:7", translation: "NIV" },
    { verse: "All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness.", reference: "2 Timothy 3:16", translation: "NIV" },
    { verse: "Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.", reference: "Galatians 6:9", translation: "NIV" },
    { verse: "But the Lord is faithful, and he will strengthen you and protect you from the evil one.", reference: "2 Thessalonians 3:3", translation: "NIV" },
    { verse: "Now faith is confidence in what we hope for and assurance about what we do not see.", reference: "Hebrews 11:1", translation: "NIV" },
    { verse: "Consider it pure joy, my brothers and sisters, whenever you face trials of many kinds.", reference: "James 1:2", translation: "NIV" },
    { verse: "Cast all your anxiety on him because he cares for you.", reference: "1 Peter 5:7", translation: "NIV" },
    { verse: "The Lord is not slow in keeping his promise, as some understand slowness.", reference: "2 Peter 3:9", translation: "NIV" },
    { verse: "If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness.", reference: "1 John 1:9", translation: "NIV" },
    { verse: "Dear friends, let us love one another, for love comes from God.", reference: "1 John 4:7", translation: "NIV" },
    { verse: "I have no greater joy than to hear that my children are walking in the truth.", reference: "3 John 1:4", translation: "NIV" },
    { verse: "Keep yourselves in God's love as you wait for the mercy of our Lord Jesus Christ to bring you to eternal life.", reference: "Jude 1:21", translation: "NIV" },
    
    // New Testament - Revelation (1 book)
    { verse: "Look, I am coming soon! My reward is with me, and I will give to each person according to what they have done.", reference: "Revelation 22:12", translation: "NIV" }
  ]

  // Using Bible Gateway API with CORS proxy
  const fetchRandomVerseFromAPI = async () => {
    try {
      // Using a CORS proxy to access Bible Gateway API
      const corsProxy = 'https://cors-anywhere.herokuapp.com/'
      const bibleGatewayUrl = 'https://www.biblegateway.com/votd/get/?format=json&version=NIV'
      const response = await fetch(corsProxy + bibleGatewayUrl)
      
      if (!response.ok) {
        throw new Error('API request failed')
      }
      
      const data = await response.json()
      
      // Process the API response
      if (data && data.votd) {
        return {
          verse: data.votd.text,
          reference: data.votd.display_ref,
          translation: data.votd.version_id || 'NIV',
          book: data.votd.book_name,
          chapter: data.votd.chapter,
          verse_number: data.votd.verse
        }
      }
      
      return null
    } catch (error) {
      console.error('API Error:', error)
      return null
    }
  }

  // Alternative: Using Bible.org API (also free)
  const fetchVerseFromBibleOrg = async () => {
    try {
      // Bible.org API - using their public endpoint
      const response = await fetch('https://labs.bible.org/api/?passage=random&formatting=plain&type=json')
      
      if (!response.ok) {
        throw new Error('Bible.org API request failed')
      }
      
      const data = await response.json()
      
      if (data && data.length > 0) {
        const verseData = data[0]
        const verseText = verseData.text || 'No text available'
        const bookName = verseData.bookname || 'Unknown'
        const chapter = verseData.chapter || 1
        const verseNumber = verseData.verse || 1
        
        return {
          verse: verseText,
          reference: `${bookName} ${chapter}:${verseNumber}`,
          translation: 'NIV',
          book: bookName,
          chapter: parseInt(chapter),
          verse_number: parseInt(verseNumber)
        }
      }
      
      return null
    } catch (error) {
      console.error('Bible.org API Error:', error)
      return null
    }
  }

  // New: Using a working Bible API without CORS issues
  const fetchVerseFromWorkingAPI = async () => {
    try {
      // Using a public Bible API that doesn't have CORS restrictions
      const response = await fetch('https://bible-api.com/?random=verse')
      
      if (!response.ok) {
        throw new Error('Bible API request failed')
      }
      
      const data = await response.json()
      
      if (data && data.text && data.reference) {
        // The API already provides the reference, so use it directly
        const verseText = data.text.trim()
        const reference = data.reference
        const translation = data.translation_name || 'World English Bible'
        
        // Extract book, chapter, verse from the reference
        const referenceParts = reference.split(' ')
        const lastPart = referenceParts[referenceParts.length - 1] // e.g., "38:18"
        const [chapter, verse] = lastPart.split(':')
        const bookName = referenceParts.slice(0, -1).join(' ') // Everything except the last part
        
        return {
          verse: verseText,
          reference: reference,
          translation: translation,
          book: bookName,
          chapter: parseInt(chapter),
          verse_number: parseInt(verse)
        }
      }
      
      return null
    } catch (error) {
      console.error('Working API Error:', error)
      return null
    }
  }

  const getDailyVerse = () => {
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const verseIndex = dayOfYear % dailyVerses.length
    return dailyVerses[verseIndex]
  }

  const refreshVerse = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Try the working Bible API first (no CORS issues)
      let apiVerse = await fetchVerseFromWorkingAPI()
      
      // If that fails, try Bible.org
      if (!apiVerse) {
        apiVerse = await fetchVerseFromBibleOrg()
      }
      
      // If Bible.org fails, try Bible Gateway with CORS proxy
      if (!apiVerse) {
        apiVerse = await fetchRandomVerseFromAPI()
      }
      
      if (apiVerse && apiVerse.reference) {
        setVerse(apiVerse)
        setError(null)
      } else {
        // Fallback to random local verse if API data is incomplete
        const randomIndex = Math.floor(Math.random() * dailyVerses.length)
        setVerse(dailyVerses[randomIndex])
        setError('Using offline verses - API data incomplete')
      }
    } catch (error) {
      // Fallback to random local verse
      const randomIndex = Math.floor(Math.random() * dailyVerses.length)
      setVerse(dailyVerses[randomIndex])
      setError('Using offline verses - Network error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const dailyVerse = getDailyVerse()
    setVerse(dailyVerse)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!verse) {
    return null
  }

  return (
    <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800 p-6 md:p-8">
      <div className="absolute top-4 right-4">
        <button
          onClick={refreshVerse}
          className="p-2 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-800/30 rounded-lg transition-colors"
          title="Get another verse from API"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <BookOpen className="w-6 h-6 text-amber-600 dark:text-amber-400 mr-2" />
          <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
            Daily Bible Verse
          </span>
        </div>
        
        {error && (
          <div className="flex items-center justify-center mb-4 text-xs text-amber-600 dark:text-amber-400">
            <AlertCircle className="w-3 h-3 mr-1" />
            {error}
          </div>
        )}
        
        <blockquote className="text-lg md:text-xl font-medium text-gray-900 dark:text-gray-100 mb-4 leading-relaxed">
          "{verse.verse}"
        </blockquote>
        
        <div className="text-sm text-amber-700 dark:text-amber-300 font-medium">
          — {verse.reference} ({verse.translation})
        </div>
      </div>
    </div>
  )
}

export default BibleVerse
