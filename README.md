# eflex-volume-smoke

Dépôt **jetable** servant à valider les volumes persistants Coolify de la
plateforme Eflex (voir `docs/operations/volumes.md` dans le dépôt `eflex`).

Application Node sans aucune dépendance :

| Route | Effet |
| --- | --- |
| `GET /` | répond `ok` |
| `GET /write` | écrit un horodatage et le nom d'hôte dans `/data/eflex-volume-test.txt` |
| `GET /read` | renvoie le contenu du fichier (404 s'il n'existe pas) |

Le point de montage `/data` correspond au stockage persistant Coolify
`eflex-volume-test` créé par `POST /applications/{uuid}/storages`
(`{"type":"persistent","name":"eflex-volume-test","mount_path":"/data"}`).

## Utilisation

```bash
PORT=3000 npm start
curl -s localhost:3000/write
curl -s localhost:3000/read
```

Après un redéploiement, `/read` doit toujours renvoyer le même horodatage :
c'est la preuve de persistance. Ce dépôt ne contient aucune donnée sensible et
peut être archivé après la validation.
