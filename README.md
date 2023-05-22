# Bird Watching Progressive Web Application
Group Assessment for COM3504-6504 The Intelligent Web

# Team U 28

- Yabo Ye (yye28@sheffield.ac.uk)
- Jiacong Wu (jwu102@sheffield.ac.uk)
- Jakub Zamojda (jzamojda1@sheffield.ac.uk)
- Ross Vickers (rvickers1@sheffield.ac.uk)

## First time setting up repository with WebStorm
1. Run `npm install` first
2. Right click on `/bin/www`， click Run 'www'.
3. In the top right hand corner will see `www` in a box, click on the inverted triangle button.
4. `Edit Configurations...`
6. Set `JavaScript file` field to `bin\www`
7. Set `Environment variables` field to `DEBUG=com3504-bird-watching:*`

## Implementation

- In the `Homepage`, users can see the list of sightings, including an image, the date and time, 
  the identification ,and the user's nickname.
- The sighting list on the homepage is sorted by default in `descending order` 
  by date(the more recent, the higher the ranking).
- In the Homepage, User can make a new sighting by a button named `Add Sighting`, choose the time,
  choose the identification, upload a description and an image.
- When website go offline, user can still add new sighting too.
- In the Homepage, user can click `View Details` which will go to the Sighting Details page.
  for a specific sighting.
- In the Sighting Details page, user can see more information about the sighting: User's name(Author),
  Date and time, the identification, a description made by author, the sighting image,
  A description and a link from DBPedia. Finally, A chat system in the bottom.
- In the detail page, user can update the identification by click `Change Identification`.
- When system go online again, can merge the sighting made in offline to the database by click button `click to sync offline data`,
  user can see them in homepage too.
