CREATE OR REPLACE FUNCTION DeviceLocation_Filter
	("DeviceId" INT,
    "StartDate" TIMESTAMP,
    "EndDate" TIMESTAMP
	)
returns setof "LocationStorages"
LANGUAGE plpgsql
	AS $$
BEGIN

	RETURN QUERY SELECT ls.* FROM "LocationStorages" as ls
	WHERE	CAST(ls."Timestamp" AT TIME ZONE 'CET' AS TIME) >= CAST("StartDate" AS TIME)
			AND CAST(ls."Timestamp" AT TIME ZONE 'CET' AS TIME) <= CAST("EndDate" AS TIME)
			AND ls."DeviceID" = "DeviceId"
			AND CAST(ls."Timestamp" AS DATE) >= CAST("StartDate" as DATE)
			AND CAST(ls."Timestamp" AS DATE) <= CAST("EndDate" as DATE)
	ORDER BY ls."Timestamp" asc;

END;
$$;
