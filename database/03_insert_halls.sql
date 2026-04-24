IF NOT EXISTS (SELECT 1 FROM dbo.Halls)
BEGIN
    INSERT INTO dbo.Halls (name, rows, cols)
    VALUES
    ('Hall 1', 10, 12),
    ('Hall 2', 8, 10),
    ('Hall 3', 6, 8);
END
GO

