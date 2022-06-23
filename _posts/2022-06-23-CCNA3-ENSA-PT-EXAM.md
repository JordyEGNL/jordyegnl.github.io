---S2
title: CCNA 3 ENSA Packettracer exam
layout: post
categories: [ccna,ensa]
tags: [ccna,ensa]
---

# CCNA ENSA PT EXAM

## R1

```terminal
enable
configure terminal 

no ip domain lookup
hostname R1
enable secret ciscoenpass
line console 0
password ciscoconpass
login
exit

security passwords min-length 10
service password-encryption 
banner motd #Unauthorized Acess is Prohibited#

interface GigabitEthernet0/0/0
description CONNECTION TO R2
ip address 198.51.100.1 255.255.255.252
no shutdown

interface GigabitEthernet0/0/1
description CONNECTION TO S2
ip address 192.168.1.1 255.255.255.0
no shutdown

interface GigabitEthernet0/0/2
description CONNECTION TO S1
ip address 64.100.1.1 255.255.255.248
no shutdown

ip domain name ccna-lab.com
username admin secret admin1pass

line vty 0 15
login local
transport input ssh 
exit

crypto key generate rsa
1024

ip ssh version 2

router ospf 1
router-id 0.0.0.1
network 64.100.1.0 0.0.0.7 area 0
network 198.51.100.0 0.0.0.3 area 0
exit

router ospf 1
passive-interface GigabitEthernet0/0/1
passive-interface GigabitEthernet0/0/2
auto-cost reference-bandwidth 1000
exit

interface GigabitEthernet0/0/0
ip ospf network point-to-point
ip ospf hello-interval 30
exit

ip nat inside source static 192.168.1.5 64.100.1.7

interface GigabitEthernet0/0/0
ip nat outside
interface GigabitEthernet0/0/1
ip nat inside

ip access-list standard R1-VTY-LIMIT
permit host 192.168.1.5

line vty 0 15
access-class R1-VTY-LIMIT in
exit
```

## R2

```terminal
enable
configure terminal 

no ip domain lookup
hostname R2
enable secret ciscoenpass
line console 0
password ciscoconpass
login
exit

security passwords min-length 10
service password-encryption 
banner motd #Unauthorized Acess is Prohibited#

interface GigabitEthernet0/0/0
description CONNECTION TO R1
ip address 198.51.100.2 255.255.255.252
no shutdown

interface GigabitEthernet0/0/1
description CONNECTION TO S4
ip address 172.16.2.1 255.255.255.0
no shutdown

interface GigabitEthernet0/0/2
description CONNECTION TO S3
ip address 209.165.202.129 255.255.255.224
no shutdown

ip domain name ccna-lab.com
username admin secret admin1pass

line vty 0 15
login local
transport input ssh 
exit

crypto key generate rsa
1024

ip ssh version 2

router ospf 1
router-id 0.0.0.2
network 209.165.202.128 0.0.0.31 area 0
network 198.51.100.0 0.0.0.3 area 0
exit

router ospf 1
passive-interface GigabitEthernet0/0/1
passive-interface GigabitEthernet0/0/2
auto-cost reference-bandwidth 1000
exit

interface GigabitEthernet0/0/0
ip ospf network point-to-point
ip ospf hello-interval 30
exit

ip nat pool IPNAT1 209.165.202.140 209.165.202.150 netmask 255.255.255.224
ip nat inside source list 1 pool IPNAT1 overload
access-list 1 permit 172.16.2.0 0.0.0.15

interface GigabitEthernet0/0/1
ip nat inside

ip access-list standard R2-VTY-LIMIT
permit host 172.16.2.5

line vty 0 15
access-class R2-VTY-LIMIT in
exit

ip access-list extended R2-SECURITY
permit tcp host 64.100.1.7 host 209.165.202.131 eq ftp
deny tcp any any eq ftp
deny tcp any any eq 22
permit ip any any

interface GigabitEthernet0/0/0
ip access-group R2-SECURITY in
ip nat outside
exit
```

## S1

```terminal
enable
configure ter
configure terminal 

hostname S1
interface Vlan1
ip address 64.100.1.2 255.255.255.248
no shutdown 

ip default-gateway 64.100.1.1

ip access-list standard S1-VTY-LIMIT
permit host 192.168.1.5

line vty 0 15
access-class S1-VTY-LIMIT in
exit
```


## S2

```terminal
enable
configure terminal 

hostname S2
interface Vlan1
ip address 192.168.1.2 255.255.255.0
no shutdown 

ip default-gateway 192.168.1.1
```

## S3

```terminal
enable
config ter

hostname S3
interface Vlan1
ip address 209.165.202.130 255.255.255.224
no shutdown 

ip default-gateway 209.165.202.129

ip access-list standard S3-VTY-LIMIT
permit host 172.16.2.5

line vty 0 15
access-class S3-VTY-LIMIT in
```

## S4

```terminal
enable
config ter
hostname S4
interface Vlan1
ip address 172.16.2.2 255.255.255.0
no shutdown 

ip default-gateway 172.16.2.1
```