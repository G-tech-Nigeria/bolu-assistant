import { ExternalLink, User, Linkedin, Github, Globe, Download } from 'lucide-react'
import BMLogo from './BMLogo'

const Portfolio = () => {

  // Portfolio links with actual URLs
  const portfolioLinks = [
    {
      title: 'Personal Portfolio',
      description: 'My main portfolio showcasing projects and skills',
      url: 'https://portfolioupdates.vercel.app/',
      icon: Globe,
      color: 'bg-blue-500'
    },
    {
      title: 'GitHub Profile',
      description: 'View my code repositories and contributions',
      url: 'https://github.com/bolubme',
      icon: Github,
      color: 'bg-gray-800'
    },
    {
      title: 'LinkedIn Profile',
      description: 'Professional experience and network',
      url: 'https://www.linkedin.com/in/boluwatife-morolari',
      icon: Linkedin,
      color: 'bg-blue-600'
    },
    {
      title: 'Online Business Card',
      description: 'My link tree with all professional links',
      url: 'https://portfolioupdates.vercel.app/links',
      icon: User,
      color: 'bg-orange-500'
    }
  ]



  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
      {/* Header */}
      <div className="text-center py-8 md:py-12">
        <div className="flex items-center justify-center mb-4 md:mb-6">
          <BMLogo size="lg" className="mr-3" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
            Portfolio & Links
          </h1>
        </div>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
          Connect with me professionally and explore my work.
        </p>
      </div>

      {/* Portfolio Links */}
      <div className="space-y-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolioLinks.map((link) => (
              <a
                key={link.title}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 cursor-pointer block"
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${link.color} mr-4`}>
                    <link.icon className="w-6 h-6 text-white" />
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors ml-auto" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {link.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {link.description}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Portfolio
