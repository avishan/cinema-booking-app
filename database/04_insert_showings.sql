IF NOT EXISTS (SELECT 1 FROM dbo.Showings)
BEGIN
    INSERT INTO dbo.Showings (movie_id, hall_id, start_time, end_time, base_price_cents, status)
    VALUES
    (1, 1, '2026-05-08 18:00:00', '2026-05-08 20:28:00', 1299, 'active'),
    (1, 2, '2026-05-10 20:00:00', '2026-05-10 22:28:00', 1199, 'active'),

    (7, 2, '2026-05-09 19:00:00', '2026-05-09 22:12:00', 1399, 'active'),

    (12, 3, '2026-05-11 16:30:00', '2026-05-11 17:51:00', 999, 'active');
END
GO