IF NOT EXISTS (SELECT 1 FROM dbo.Movies)
BEGIN
    INSERT INTO dbo.Movies (title, duration_min, genre)
    VALUES
    ('Inception', 148, 'Action'),
    ('The Dark Knight', 152, 'Action'),
    ('Interstellar', 169, 'Action'),
    ('3 Idiots', 170, 'Comedy'),
    ('The Notebook', 123, 'Romance'),
    ('The Polar Express', 100, 'Animation'),
    ('Titanic', 192, 'Romance'),
    ('La La Land', 128, 'Romance'),
    ('Home Alone', 103, 'Comedy'),
    ('The Hangover', 100, 'Comedy'),
    ('Toy Story', 81, 'Animation'),
    ('Frozen', 102, 'Animation');
END
GO