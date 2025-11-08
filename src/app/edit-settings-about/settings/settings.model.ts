export enum TimeRemainingText
{
    Days = "Days",
    Weeks = "Weeks and Days",
    Months = "Months, Weeks and Days",
    MonthsDays = "Months and Days"
}

export enum MilestoneLabelFormat
{
    Name = "Name",
    Date = "Date",
    Percentage = "Percentage",
    DayNumber = "Day Number"
}

export enum Theme
{
    Light = "Light",
    Dark = "Dark"
}

export enum Language
{
    English = "English",
    French = "Français",
    German = "Deutsch",
    Spanish = "Español",
    Portuguese = "Português",
    Italian = "Italiano",
    Polish = "Polski",
    Russian = "Русский"
}

export enum NotificationSetting
{
    Both = "Both",
    Countdowns = "Countdowns Only",
    Milestones = "Milestones Only",
    Off = "Off"
}

export enum Wallpaper
{
    Default = "Default",
    BoatHouse = "https://upload.wikimedia.org/wikipedia/commons/a/aa/Herrsching_am_Ammersee_Bootshaus_351.jpg",
    OldBuilding = "https://upload.wikimedia.org/wikipedia/commons/5/57/Building_in_Floyd_Bennett_Field_%2840715h%29.jpg",
    LondonEye = "https://upload.wikimedia.org/wikipedia/commons/6/6c/London_Eye_at_night_2.jpg",
    Canal = "https://upload.wikimedia.org/wikipedia/commons/6/66/Bamberg_Bavaria_80_.jpg",
    SkiResort = "https://upload.wikimedia.org/wikipedia/commons/a/a1/Gunzesried_Bavaria_Germany_Konraedler-Hof-01.jpg",
    Houses = "https://upload.wikimedia.org/wikipedia/commons/3/3d/Thurnau%2C_Marktplatz_10%2C_006.jpg",
    Custom = "Custom"
}

export enum WallpaperPreview
{
    BoatHouse = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Herrsching_am_Ammersee_Bootshaus_351.jpg/330px-Herrsching_am_Ammersee_Bootshaus_351.jpg",
    OldBuilding = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Building_in_Floyd_Bennett_Field_%2840715h%29.jpg/330px-Building_in_Floyd_Bennett_Field_%2840715h%29.jpg",
    LondonEye = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/London_Eye_at_night_2.jpg/330px-London_Eye_at_night_2.jpg",
    Canal = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Bamberg_Bavaria_80_.jpg/330px-Bamberg_Bavaria_80_.jpg",
    SkiResort = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Gunzesried_Bavaria_Germany_Konraedler-Hof-01.jpg/330px-Gunzesried_Bavaria_Germany_Konraedler-Hof-01.jpg",
    Houses = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Thurnau%2C_Marktplatz_10%2C_006.jpg/330px-Thurnau%2C_Marktplatz_10%2C_006.jpg",
}

export interface Settings
{
    timeRemainingText: TimeRemainingText,
    milestoneLabelFormat: MilestoneLabelFormat,
    wallpaperLight: Wallpaper,
    wallpaperDark: Wallpaper,
    customWallpaperUrl: string,
    theme: Theme,
    autoTheme: boolean,
    language: Language,
    notifications: NotificationSetting
}

export interface Phrases
{
    day: string,
    days: string,
    week: string,
    weeks: string,
    month: string,
    months: string,
    remaining: string,
    remainingUntil: string,
    completed: string,
    sinceStart: string,
    milestonesCompletedToday: string
}