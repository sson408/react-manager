export interface PropertyDetail {
  guid: string
  address: string
  statusId: number
  listingAgent1Guid: string
  listingAgent1Name: string
  listingAgent2Guid: string
  listingAgent2Name: string
  listingAgentNameDisplay: string
  buyer1FirstName: string
  buyer1LastName: string
  buyer1PhoneNumber: string
  buyer1Email: string
  buyer2FirstName: string
  buyer2LastName: string
  buyer2PhoneNumber: string
  buyer2Email: string
  originalOwnerFirstName: string
  originalOwnerLastName: string
  originalOwnerPhoneNumber: string
  originalOwnerEmail: string
  imageUrl: string
  soldPrice: number
  typeId: number
  dateTimeDisplay: string
  updatedDateTimeDisplay: string
  firstPartPrice: number
  firstPartPercentage: number
  restPartPrice: number
  restPartPercentage: number
  commission: number
}

export interface PropertyUpdateSummary {
  guid?: string
  address?: string
  statusId?: number
  typeId?: number
  listingAgent1Guid?: string
  listingAgent2Guid?: string
  dateTimeStamp?: number
  firstPartPrice?: number
  firstPartPercentage?: number
  restPartPrice?: number
  restPartPercentage?: number
  commission?: number
  buyer1FirstName?: string
  buyer1LastName?: string
  buyer1PhoneNumber?: string
  buyer1Email?: string
  buyer2FirstName?: string
  buyer2LastName?: string
  buyer2PhoneNumber?: string
  buyer2Email?: string
  originalOwnerFirstName?: string
  originalOwnerLastName?: string
  originalOwnerPhoneNumber?: string
  originalOwnerEmail?: string
  soldPrice?: number
}

export interface PropertySearchSummary {
  filterWord?: string
  statusId?: number
  typeId?: number
}
