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
	WHERE	ls."DeviceID" = "DeviceId"
		AND ls."Timestamp" >= "StartDate"
		AND ls."Timestamp" <= "EndDate"
	ORDER BY ls."Timestamp" asc;

END;
$$;

