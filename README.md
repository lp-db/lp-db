# LP-DB

[https://lp-db.github.io/lp-db/](https://lp-db.github.io/lp-db/)

Login Pages Database forms a knowledge base on login pages related to malicious activities (C2, phishing, TDS...).

This library uses [urlscan.io](https://urlscan.io/), allowing to have screenshots of unified size and to have access to the DOM of the pages. In addition, each login page has tags to better define their use cases. Whenever possible, a [Malpedia](https://malpedia.caad.fkie.fraunhofer.de/) link is also present.

It's possible that some login pages don't correspond to their description or their tags, these data are provided on best effort. In this case, or in order to complete the database, don't hesitate to open an issue/pull request. You can also contact me on [Twitter](https://twitter.com/DrStache_).

## Reverse Image Search

It's possible to perform a reverse image search to identify a login page. For best results, it's recommended to use screenshots from [urlscan.io](https://urlscan.io). Everything is done client side, the image recognition is based on [blockhash perceptual image hashing algorithm](https://github.com/LinusU/blockhash-core).

## Acknowledgements

- [misterch0c](https://twitter.com/eatmych0c/) for the original idea with [what_is_this_c2](https://github.com/misterch0c/what_is_this_c2)
- C2 Trackers: [benkow](http://benkow.cc/passwords.php), [CyberCrime-Tracker](https://cybercrime-tracker.net), [ThreatShare](https://threatshare.io/malware) and [ViriBack](http://tracker.viriback.com)
- Everyone who's sharing C2 panels on Twitter
- [urlscan.io](https://urlscan.io/) submitters
- [Hedroed](https://github.com/Hedroed) and [b0oml](https://github.com/b0oml) for the web app
