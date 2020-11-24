# LP-DB

[https://lp-db.github.io/lp-db/](https://lp-db.github.io/lp-db/)

Login Pages Database forms a knowledge base on login pages related to malicious activities (C2 panels, phishing kits...).

This encyclopedia uses [urlscan.io](https://urlscan.io/), allowing to have screenshots of unified size and to have access to the DOM of the pages. In addition, each login page has tags to better define their use cases. Whenever possible, a [Malpedia](https://malpedia.caad.fkie.fraunhofer.de/) link is also present.

It's possible that some login pages don't correspond to their name or their tags, these data are provided on best effort. In this case, or in order to complete the database, don't hesitate to contribute.

### Reverse Image Search

It's possible to perform a reverse image search to identify a login page. For best results, it's recommended to use screenshots from [urlscan.io](https://urlscan.io). Everything is done client side, the image recognition is based on [blockhash perceptual image hashing algorithm](https://github.com/LinusU/blockhash-core).

## How to contribute

There are several ways to contribute to the project by adding or identifying logins pages, they are detailed below.

> Only login pages that are not already in the database and that show a significant visual change compared to other panels of the same family will be added.

### Merge request

> You don't need to run `npm run hash` before the merge request, it's done automatically during deployment.

#### Identified login pages

To add an identified login page in the database, you need to add an entry in *data.json*.

```json
{
    "name": "AZORult",
    "id": "af4c5e46-f867-49b6-b3ad-f124694c9c6a",
    "tags": ["Windows", "Stealer", "Loader"],
    "malpedia": "win.azorult"
}
```

- *name*: name of the malware linked to the login page, phishing kit name... If the login page is a fork of a panel, or if the panel is known under two different names, specify it by separating the two names with ` / `. Example: *AZORult / ManaBotnet*, *DiamondFox / Gorynych*.
- *id*: corresponds to the uuid of the urlscan.io scan. You can find it in the url of the scan.
- *tags*: they allow you to categorize the login pages.The first tag must correspond to the platform targeted by the malware: *Windows*, *Linux*, *MacOS*, *Android*, *IOT* and *Web Browser*. There are special cases with *Phishing*, *TDS*, *Exploit-Kit*, *Mailer*, *Webshell*, for which only one tag is needed. Other tags should describe the malware's functionalities, trying as much as possible to reuse existing ones (pay attention to the case).
- *malpedia*: it should contain Malpedia's malware familly ID (if possible). You can find them here, https://malpedia.caad.fkie.fraunhofer.de/families.

#### Unidentified login pages

If you have found a login page related to malicious activities, but were unable to identify it, you can still add it by indicating *Unknown* in the *name* and in the *tags*. If the main tag has been identified, you can add it.

```json
{
    "name": "Unknown",
    "id": "3e223ae3-5955-440c-a2ed-7700d21bd72f",
    "tags": ["Android", "Unknown"]
}
```

### Issue

An issue should contain information about the panel name, urlscan.io uuid, tags to identify malware functionality and Malpedia link if possible.

If the login page has not been identified, the urlscan.io uuid is sufficient.

External links can be added in order to better understand the context in which the panel is used.

### Tweeter

You can also message me on [Twitter](https://twitter.com/DrStache_) with the urlscan.io link or tag me.

## Installation guide

### Project setup

```sh
npm install
```

### Compiles and hot-reloads for development

```sh
npm run serve
```

Every time you make changes in *data.json* you need to run `npm run hash` in order to compute perceptual hash for reverse image search and to update *src/data.js*.

### Compiles and minifies for production

```sh
npm run build
```

## Acknowledgements

- [misterch0c](https://twitter.com/eatmych0c/) for the original idea with [what_is_this_c2](https://github.com/misterch0c/what_is_this_c2)
- C2 Trackers: [benkow](http://benkow.cc/passwords.php), [CyberCrime-Tracker](https://cybercrime-tracker.net), [ThreatShare](https://threatshare.io/malware) and [ViriBack](http://tracker.viriback.com)
- Everyone who's sharing C2 panels on Twitter
- [urlscan.io](https://urlscan.io/) submitters
- [Hedroed](https://github.com/Hedroed) and [b0oml](https://github.com/b0oml) for the web app
