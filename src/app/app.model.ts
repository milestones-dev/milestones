export interface Countdown
{
    name: string,
    endMessage: string,
    startDate: Date,
    endDate: Date,
    notified: boolean,
    milestones: Milestone[]
}

export interface Milestone
{
    name: string,
    date: Date,
    notes: string,
    notified: boolean
}

export interface Show
{
    countdownsMenu: boolean,
    milestonesInfo: boolean,
    milestonesList: boolean,
    milestonesNotes: boolean,
    notificationsList: boolean,
    editSettingsAboutContainer: boolean,
    edit: boolean,
    settings: boolean,
    setTimeRemaining: boolean,
    setMilestoneLabelFormat: boolean,
    wallpaperLight: boolean,
    wallpaperDark: boolean,
    language: boolean,
    notificationSetting: boolean,
    resetEmpty: boolean,
    resetYear: boolean,
    resetSettings: boolean,
    about: boolean,
    deleteMilestoneButtons: boolean,
    deleteCountdownButtons: boolean,
    exportCountdownDialog: boolean,
    sidebarMobile: boolean,
    validationErrorsDialogEdit: boolean,
    validationErrorsDialogImport: boolean,
    countdownsMenuDeleteButtons: boolean,
    countdownsMenuDeleteConfirm: boolean,
    countdownsMenuAddOptions: boolean,
    countdownsMenuImportDialog: boolean
}

export interface Selected
{
    countdown: number,
    milestone: number
}