CREATE OR REPLACE FUNCTION DeviceLocation_Filter
	("AdminID" INT,
    "StartDate" TIMESTAMP,
    "EndDate" TIMESTAMP
	)
returns setof "LocationStorages"
LANGUAGE plpgsql
	AS $$
	DECLARE
    CompanyID INT;
BEGIN
 	CREATE TEMP TABLE DeviceIds (
        DeviceID int
    );

	SELECT u."CompanyID" INTO CompanyID
	FROM "Users" as u
	WHERE u."UserID" = "AdminID";

	INSERT INTO DeviceIds
	SELECT d."DeviceID"
	FROM "Devices" as d
	INNER JOIN "Users" u on u."UserID" = d."UserID"
	WHERE u."CompanyID" = CompanyID;

	RETURN QUERY SELECT ls.* FROM "LocationStorages" as ls
	INNER JOIN DeviceIds d on ls."DeviceID" = d.DeviceID
	WHERE CAST(ls."Timestamp" AT TIME ZONE 'CET' AS TIME) >= CAST("StartDate" AS TIME) and CAST(ls."Timestamp" AT TIME ZONE 'CET' AS TIME) <= CAST("EndDate" AS TIME)
	ORDER BY ls."Timestamp" asc;

	DROP TABLE DeviceIds;
END;
$$;
