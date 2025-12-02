interface IAdminDashboardDTO {
  animals: {
    total: number
    active: number
  }
  sponsors: {
    total: number
    active: number
    deleted: number
  }
  sponsorships: {
    totalActive: number
  }
  donations: {
    total: number
    thisMonth: number
    general: {
      total: number
      average: number
    }
    day: {
      total: number
      average: number
    }
    week: {
      total: number
      average: number
    }
    month: {
      total: number
      average: number
    }
    year: {
      total: number
      average: number
    }
  }
  topAnimals?: Array<{
    uuid: string
    name: string
    type: string
    sponsorshipCount: number
  }>
  topSponsors?: Array<{
    uuid: string
    name: string
    email: string
    totalDonations: number
  }>
}

interface ISponsorDashboardDTO {
  godchildren: {
    total: number
  }
  contributions: {
    total: number
  }
  monthsAsSponsor: number
  donations: {
    general: {
      total: number
      average: number
    }
    day: {
      total: number
      average: number
    }
    week: {
      total: number
      average: number
    }
    month: {
      total: number
      average: number
    }
    year: {
      total: number
      average: number
    }
  }
  firstSponsorshipDate: string
  history?: {
    firstSponsorshipDate: Date | string
    totalSponsorshipsEver: number
  }
}

export { IAdminDashboardDTO, ISponsorDashboardDTO }
