USE [Cinema];
GO

SET ANSI_NULLS ON;
GO
SET QUOTED_IDENTIFIER ON;
GO

/* =========================================================
   01_create_tables.sql  (REBUILDABLE ORDER)
   Order:
   1) Movies
   2) Halls
   3) Showings   (FK -> Movies, Halls)
   4) Users
   5) Bookings   (FK -> Users, Showings)
   6) Booking_seats (FK -> Bookings, Showings)
   7) Messages
   ========================================================= */


/* =========================
   1) Movies
   ========================= */
CREATE TABLE [dbo].[Movies](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[title] [nvarchar](200) NOT NULL,
	[duration_min] [int] NOT NULL,
	[genre] [nvarchar](50) NULL,
 CONSTRAINT [PK_Movies] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


/* =========================
   2) Halls
   ========================= */
CREATE TABLE [dbo].[Halls](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](50) NOT NULL,
	[rows] [int] NOT NULL,
	[cols] [int] NOT NULL,
 CONSTRAINT [PK_Halls] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


/* =========================
   3) Showings
   ========================= */
CREATE TABLE [dbo].[Showings](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[movie_id] [int] NOT NULL,
	[hall_id] [int] NOT NULL,
	[start_time] [datetime2](7) NOT NULL,
	[end_time] [datetime2](7) NOT NULL,
	[base_price_cents] [int] NOT NULL,
	[status] [nvarchar](20) NOT NULL,
 CONSTRAINT [PK_Showings] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Showings]  WITH CHECK ADD  CONSTRAINT [FK_Showings_Halls] FOREIGN KEY([hall_id])
REFERENCES [dbo].[Halls] ([id])
GO

ALTER TABLE [dbo].[Showings] CHECK CONSTRAINT [FK_Showings_Halls]
GO

ALTER TABLE [dbo].[Showings]  WITH CHECK ADD  CONSTRAINT [FK_Showings_Movies] FOREIGN KEY([movie_id])
REFERENCES [dbo].[Movies] ([id])
GO

ALTER TABLE [dbo].[Showings] CHECK CONSTRAINT [FK_Showings_Movies]
GO


/* =========================
   4) Users
   ========================= */
CREATE TABLE [dbo].[Users](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[email] [nvarchar](255) NOT NULL,
	[password_hash] [nvarchar](255) NOT NULL,
	[role] [nvarchar](20) NOT NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [IX_Users] UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


/* =========================
   5) Bookings
   ========================= */
CREATE TABLE [dbo].[Bookings](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NOT NULL,
	[showing_id] [int] NOT NULL,
	[status] [nvarchar](50) NOT NULL,
	[total_price_cents] [int] NOT NULL,
	[reserved_until] [datetime2](7) NULL,
 CONSTRAINT [PK_Bookings] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Bookings]  WITH CHECK ADD  CONSTRAINT [FK_Bookings_Showings] FOREIGN KEY([showing_id])
REFERENCES [dbo].[Showings] ([id])
GO

ALTER TABLE [dbo].[Bookings] CHECK CONSTRAINT [FK_Bookings_Showings]
GO

ALTER TABLE [dbo].[Bookings]  WITH CHECK ADD  CONSTRAINT [FK_Bookings_Users] FOREIGN KEY([user_id])
REFERENCES [dbo].[Users] ([id])
GO

ALTER TABLE [dbo].[Bookings] CHECK CONSTRAINT [FK_Bookings_Users]
GO

/* =========================
   6) Booking_seats
   ========================= */
USE [Cinema]
GO

/****** Object:  Table [dbo].[Booking_seats]    Script Date: 4/13/2026 1:44:26 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Booking_seats](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[booking_id] [int] NOT NULL,
	[showing_id] [int] NOT NULL,
	[seat_row] [int] NOT NULL,
	[seat_col] [int] NOT NULL,
 CONSTRAINT [PK_Booking_seats] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Booking_seats]  WITH CHECK ADD  CONSTRAINT [FK_Booking_seats_Bookings] FOREIGN KEY([booking_id])
REFERENCES [dbo].[Bookings] ([id])
GO

ALTER TABLE [dbo].[Booking_seats] CHECK CONSTRAINT [FK_Booking_seats_Bookings]
GO

ALTER TABLE [dbo].[Booking_seats]  WITH CHECK ADD  CONSTRAINT [FK_Booking_seats_Showings] FOREIGN KEY([showing_id])
REFERENCES [dbo].[Showings] ([id])
GO

ALTER TABLE [dbo].[Booking_seats] CHECK CONSTRAINT [FK_Booking_seats_Showings]
GO
ALTER TABLE [dbo].[Booking_seats]
ADD CONSTRAINT [UQ_BookingSeats_Showing_Seat]
UNIQUE ([showing_id], [seat_row], [seat_col]);
GO





/* =========================
   7) Messages
   ========================= */
CREATE TABLE [dbo].[Messages](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](100) NOT NULL,
	[FamilyName] [varchar](100) NOT NULL,
	[Email] [varchar](150) NOT NULL,
	[Message] [varchar](max) NOT NULL,
	[CreatedAt] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[Messages] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO


