CREATE OR REPLACE FUNCTION DeviceLocation_Filter
	("DeviceIds" INT[],
    "StartDate" TIMESTAMP,
    "EndDate" TIMESTAMP
	)
returns setof "LocationStorages"
LANGUAGE plpgsql
AS $$
DECLARE
temp_id INT;
BEGIN
	FOREACH temp_id IN ARRAY "DeviceIds" LOOP
		RETURN QUERY SELECT ls.* FROM "LocationStorages" as ls
		WHERE	ls."DeviceID" = temp_id
				AND ls."Timestamp" >= "StartDate"
				AND ls."Timestamp" <= "EndDate"
		ORDER BY ls."Timestamp" asc;
	END LOOP;

END;
$$;
