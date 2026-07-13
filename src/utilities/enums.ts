export enum UserRoles {
	Admin = 1,
	NormalUser = 2,
	PCSOfficeUser = 3,
	Technician = 4,
}

export enum OrderStatus {
	Pending = 0, // Pending Approval
	Active = 1, // Active
	Inactive = 2, // Inactive
	Deleted = 3, // Deleted
	Approved = 4, // Approved
	Rejected = 5, // Rejected
	InProgress = 6, // In Progress
	Completed = 7, // Completed
	Cancelled = 8, // Cancelled
	Assigned = 9, // Assigned
}

export enum VerifyOfficerOrderRequestStatus {
	Pending = 0, // Request sent to office, no action taken yet
	Approved = 1, // PCS office accepted the request and will handle it
	Rejected = 2, // PCS office rejected the request
	Scheduled = 3, // Service has been scheduled by the PCS office
	Completed = 4, // Service was successfully completed
	Discarded = 5, // Discarded as another office accepted the request
	Expired = 6, // Request expired due to no response
	Failed = 7, // Service attempt failed
	Cancelled = 9, // Cancelled by user, office, or admin
}

export enum TransactionStatus {
	Pending = 0, // Transaction created but not completed
	Success = 1, // Payment successful
	Failed = 2, // Payment failed
	Cancelled = 3, // Payment cancelled by user or system
	Refunded = 4, // Payment refunded
}

export enum PaymentMethod {
	CashOnDelivery = 0, // CashOnDelivery (offline)
	CreditCard = 1, // Credit Card
	DebitCard = 2, // Debit Card
	UPI = 3, // UPI
	NetBanking = 4, // NetBanking
	Wallet = 5, // Wallet
	Other = 9, // Other
}

export enum DATE_FORMAT {
	DD_MM_YY = 'DD/MM/YY',
	DD_MM_YY_DASHED = 'DD-MM-YY',
	DD_MM_YYYY = 'DD/MM/YYYY',
	DD_MM_YYYY_DASHED = 'DD-MM-YYYY',
	DD_MMM_YYYY = 'DD/MMM/YYYY',
	DD_MMM_YYYY_DASHED = 'DD-MMM-YYYY',
	DD_MM_YYYY_HH_MM_A = 'DD/MM/YYYY hh:mm A',
	DD_MMM_YYYY_HH_MM_A = 'DD/MMM/YYYY hh:mm A',
	DD_MM_YYYY_HH_MM_A_DASHED = 'DD-MM-YYYY hh:mm A',
	DD_MMM_YYYY_HH_MM_A_DASHED = 'DD-MMM-YYYY hh:mm A',
	YYYY_MM_DD_TIME_API = 'YYYY-MM-DDThh:mm',
	HH_MM_A = 'HH:MM A',
	YYYY_MM_DD = 'YYYY/MM/DD',
	YYYY_MM_DD_DASHED = 'YYYY-MM-DD',
}

export enum TechnicianStatus {
	Assigned = 1, // PCS office has assigned the technician
	InTransit = 2, // Technician is en route (optional if not used)
	InProgress = 3, // Job has started (by anyone on the team)
	Completed = 4, // Job completed (must be done by each technician)
}
