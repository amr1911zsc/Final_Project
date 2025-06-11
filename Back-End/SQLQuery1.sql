ALTER TABLE Products 
ADD CONSTRAINT CK_Products_Description_JSON CHECK (ISJSON(Description) = 1);

