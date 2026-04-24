USE [Cinema]
GO
SET IDENTITY_INSERT [dbo].[Users] ON 
GO
INSERT [dbo].[Users] ([id], [email], [password_hash], [role]) VALUES (1, N'admin@cinema.local', N'admin_hash_placeholder', N'admin')
GO
INSERT [dbo].[Users] ([id], [email], [password_hash], [role]) VALUES (2, N'user1@mail.com', N'user_hash_placeholder', N'customer')
GO
SET IDENTITY_INSERT [dbo].[Users] OFF
GO
