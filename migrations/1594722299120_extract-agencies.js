/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.sql(`
  CREATE TABLE IF NOT EXISTS agencies(
    id INT GENERATED ALWAYS AS IDENTITY,
    "name" VARCHAR(100) NOT NULL,
    logo_data TEXT,
    PRIMARY KEY (id)
  );

  `)
  pgm.sql(`
  INSERT INTO agencies(
    "name",
    logo_data
  ) VALUES (
    'JT-Line',
    'PHN2ZyB3aWR0aD0iNzExLjYxIiBoZWlnaHQ9IjI2NS4wOSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48Y2xpcFBhdGggaWQ9ImEiPjxwYXRoIGQ9Ik0wIDc5Mmg2MTJWMEgweiIvPjwvY2xpcFBhdGg+PC9kZWZzPjxnIGNsaXAtcGF0aD0idXJsKCNhKSIgdHJhbnNmb3JtPSJtYXRyaXgoMS4zMzQgMCAwIC0xLjI0MzcgLTU2LjUxNyA2MjQuOTMyKSI+PHBhdGggZD0iTTgyLjMzNCAzNzMuMTVoMzUuODFjLjMzLTMuNTQtNC4wMzYtMi41OS01LjM1NS01LjkyNy0zLjY0Ni05LjA3Ny00LjU1OC0xOC41NS01Ljk1NS0yNy44NTktLjMxMS0yLjQwMy0xLjI0LTQuOTUxLTEuNDczLTcuNDMzLS4zMS0zLjEwNC0xLjI0NC02Ljc3LTEuODY0LTEwLjU3MS0zLjcyNS0yMS44OC0yMS45NTItMjMuODQ5LTM0LjkwOC0yMy44NDktOS4wMDIgMC0xOC4zMjUuNDM2LTI2LjA2OSAxMC44NThsMTUuMTExIDIyLjAyM2MyLjA1NS0uNjIgMi4yNjctLjYwMSAyLjI2Ny0yLjE1NiAwLTEuNTUtMi40ODEtOS4zMDktMi40ODEtMTAuODYyIDAtNy4wNiA0LjUtMTEuMTcxIDEwLjI0LTExLjE3MSAzLjI2MSAwIDYuNDc5LS41NDcgOS40MjggNC44MDUgNS4xOTggOS4zODYgNC43NzYgMTkuODQ0IDYuNTU5IDI5LjY5NyAxLjM5NyA3LjQ1MSA0LjE4NiAyMS45NzggNC4xODYgMjMuNTMgMCAyLjA5NS0xLjU3NyA1LjU4OC01LjQ5NiA1Ljk4OXoiIGZpbGw9IiMzMzZmYmYiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjxwYXRoIGQ9Ik04Mi4zMzQgMzczLjE1aDM1LjgxYy4zMy0zLjU0LTQuMDM2LTIuNTktNS4zNTUtNS45MjctMy42NDYtOS4wNzctNC41NTgtMTguNTUtNS45NTUtMjcuODU5LS4zMTEtMi40MDMtMS4yNC00Ljk1MS0xLjQ3My03LjQzMy0uMzEtMy4xMDQtMS4yNDQtNi43Ny0xLjg2NC0xMC41NzEtMy43MjUtMjEuODgtMjEuOTUyLTIzLjg0OS0zNC45MDgtMjMuODQ5LTkuMDAyIDAtMTguMzI1LjQzNi0yNi4wNjkgMTAuODU4bDE1LjExMSAyMi4wMjNjMi4wNTUtLjYyIDIuMjY3LS42MDEgMi4yNjctMi4xNTYgMC0xLjU1LTIuNDgxLTkuMzA5LTIuNDgxLTEwLjg2MiAwLTcuMDYgNC41LTExLjE3MSAxMC4yNC0xMS4xNzEgMy4yNjEgMCA2LjQ3OS0uNTQ3IDkuNDI4IDQuODA1IDUuMTk4IDkuMzg2IDQuNzc2IDE5Ljg0NCA2LjU1OSAyOS42OTcgMS4zOTcgNy40NTEgNC4xODYgMjEuOTc4IDQuMTg2IDIzLjUzIDAgMi4wOTUtMS41NzcgNS41ODgtNS40OTYgNS45ODl6IiBmaWxsPSJub25lIiBzdHJva2U9IiMzMzZmYmYiIHN0cm9rZS1taXRlcmxpbWl0PSIzLjg2NCIgc3Ryb2tlLXdpZHRoPSIuMjUiLz48cGF0aCBkPSJNMTI2LjQ1IDM3NC40M2MuNzk1LjA1NSAxLjE4NC0xLjE4OCAyLjczNS0xLjE4OGg1Ni4zMjZjMS41NSAwIDEuNzIuNTMxIDIuNjc0IDEuMjIuNzQtMjEuMzg2IDIuODQ5LTIyLjM1NS4wMjMtMjUuOTc1aC0yLjIzNWMuMDAyIDguNzc2LTEwLjM1NyAxNi44NDUtMTcuMDA3IDE2LjA5Ni0uNTM2LS41Ni0xLjEzLS41MjUtMS41NTctMS4wODUtMy4yMzctMTguNTQ5LTkuNDM5LTUzLjg3My05LjQzOS01NS40MjUgMC0yLjYzOC0uNDU1LTUuOTczIDUuNDk3LTYuMzAyLjA4OC0uODM3LS41MzMtMi4wNzctLjYyNi0yLjkxOGwtMzcuMTA4LjY5MmMxLjU2IDIuNzk1IDQuOTcgMi41NTYgNi41OTggNS4yNzUgNS4xMjIgOC42MTEgNC42MiAxOS4zNzIgNi41NTcgMjkuMDcyIDEuOTQgOS43NzYgMy41NjggMTkuODU3IDUuNDQgMjkuNjM3LS41NDMuNDk0LS4wMTUgMS4wMjUtMS41NjUgMS4wMjUtNy40NDggMC0xNy40MDItNC40NjMtMjIuMTk4LTE2LjEgMCAwLTIuODQ4LjA1Mi0zLjU1My44MjZ6IiBmaWxsPSIjMzM2ZmJmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48cGF0aCBkPSJNMTI2LjQ1IDM3NC40M2MuNzk1LjA1NSAxLjE4NC0xLjE4OCAyLjczNS0xLjE4OGg1Ni4zMjZjMS41NSAwIDEuNzIuNTMxIDIuNjc0IDEuMjIuNzQtMjEuMzg2IDIuODQ5LTIyLjM1NS4wMjMtMjUuOTc1aC0yLjIzNWMuMDAyIDguNzc2LTEwLjM1NyAxNi44NDUtMTcuMDA3IDE2LjA5Ni0uNTM2LS41Ni0xLjEzLS41MjUtMS41NTctMS4wODUtMy4yMzctMTguNTQ5LTkuNDM5LTUzLjg3My05LjQzOS01NS40MjUgMC0yLjYzOC0uNDU1LTUuOTczIDUuNDk3LTYuMzAyLjA4OC0uODM3LS41MzMtMi4wNzctLjYyNi0yLjkxOGwtMzcuMTA4LjY5MmMxLjU2IDIuNzk1IDQuOTcgMi41NTYgNi41OTggNS4yNzUgNS4xMjIgOC42MTEgNC42MiAxOS4zNzIgNi41NTcgMjkuMDcyIDEuOTQgOS43NzYgMy41NjggMTkuODU3IDUuNDQgMjkuNjM3LS41NDMuNDk0LS4wMTUgMS4wMjUtMS41NjUgMS4wMjUtNy40NDggMC0xNy40MDItNC40NjMtMjIuMTk4LTE2LjEgMCAwLTIuODQ4LjA1Mi0zLjU1My44MjZ6IiBmaWxsPSJub25lIiBzdHJva2U9IiMzMzZmYmYiIHN0cm9rZS1taXRlcmxpbWl0PSIzLjg2NCIgc3Ryb2tlLXdpZHRoPSIuMjUiLz48cGF0aCBkPSJNMjE2IDMzNC4xNGMwLTEuNTUxLTYuNzA2LTExLjMxNC05LjYyOC0xNS42MTItLjEzNi0uNTczLS42OTMgMS4zMzgtMi4yNDMgMS4zMzhoLTI0LjY3M2MtMS41NSAwLTIuNDIyLTEuMjExLTMuODk5LTEuODUgMCAwLS4xMjEuNjk2LS44MzEgMS41MTJsMTAuODM2IDE1LjIzMWEyMi40NDIgMjIuNDQyIDAgMDAyLjAwNC0xLjg3M2gyMi4xNDZjNS40MDcuMDQxIDYuMjg4IDIuMTIyIDYuMjg4IDEuMjU0IiBmaWxsPSIjMzM2ZmJmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48cGF0aCBkPSJNMjE2IDMzNC4xNGMwLTEuNTUxLTYuNzA2LTExLjMxNC05LjYyOC0xNS42MTItLjEzNi0uNTczLS42OTMgMS4zMzgtMi4yNDMgMS4zMzhoLTI0LjY3M2MtMS41NSAwLTIuNDIyLTEuMjExLTMuODk5LTEuODUgMCAwLS4xMjEuNjk2LS44MzEgMS41MTJsMTAuODM2IDE1LjIzMWEyMi40NDIgMjIuNDQyIDAgMDAyLjAwNC0xLjg3M2gyMi4xNDZjNS40MDcuMDQxIDYuMjg4IDIuMTIyIDYuMjg4IDEuMjU0eiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzM2ZmJmIiBzdHJva2UtbWl0ZXJsaW1pdD0iMy44NjQiIHN0cm9rZS13aWR0aD0iLjI1Ii8+PHBhdGggZD0iTTIzMS4zOSAzNzMuMTdoMzMuMjQ3Yy0uNTQ2LTUuMjUtNS40NC0zLjU3Ni02LjYwMS04LjM4OC00LjI2OS0xNy4wNjgtOS40NTktNTAuODItOS40NTktNTIuMzczIDAtNi40MzggNS4yNzQtNi4yMDYgNy43NTgtNi4yMDYgMTAuNDczIDAgMjEuNjA1IDkuMzc4IDI4LjM5IDIyLjI2OWgyLjI5NnYtMi42NGMuMDM5LTEuNTUyLTguNjc5LTE4LjIwOC0xMy4xNDEtMjcuNTcxaC01Ni4yNzVjMS4xOTUgNC40NjQuOTk2IDMuNzE2IDEuNjkzIDQuMjU3IDIuNjEyIDEuODgxIDQuMTA5Ljc0OSA1LjQ2NyA3LjE2MyAzLjcyNiAxNy44NDMgOS41MzggNTMuMzEzIDkuNTM4IDU0Ljg2NiAwIDIuNDc5LS4wNTggMy41OTktNC4yOTcgNS43My0uMDQ5Ljc4OC42NjUgMi4yNDUgMS4zODQgMi44OTMiIGZpbGw9IiMzMzZmYmYiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjxwYXRoIGQ9Ik0yMzEuMzkgMzczLjE3aDMzLjI0N2MtLjU0Ni01LjI1LTUuNDQtMy41NzYtNi42MDEtOC4zODgtNC4yNjktMTcuMDY4LTkuNDU5LTUwLjgyLTkuNDU5LTUyLjM3MyAwLTYuNDM4IDUuMjc0LTYuMjA2IDcuNzU4LTYuMjA2IDEwLjQ3MyAwIDIxLjYwNSA5LjM3OCAyOC4zOSAyMi4yNjloMi4yOTZ2LTIuNjRjLjAzOS0xLjU1Mi04LjY3OS0xOC4yMDgtMTMuMTQxLTI3LjU3MWgtNTYuMjc1YzEuMTk1IDQuNDY0Ljk5NiAzLjcxNiAxLjY5MyA0LjI1NyAyLjYxMiAxLjg4MSA0LjEwOS43NDkgNS40NjcgNy4xNjMgMy43MjYgMTcuODQzIDkuNTM4IDUzLjMxMyA5LjUzOCA1NC44NjYgMCAyLjQ3OS0uMDU4IDMuNTk5LTQuMjk3IDUuNzMtLjA0OS43ODguNjY1IDIuMjQ1IDEuMzg0IDIuODkzeiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzM2ZmJmIiBzdHJva2UtbWl0ZXJsaW1pdD0iMy44NjQiIHN0cm9rZS13aWR0aD0iLjI1Ii8+PHBhdGggZD0iTTMwMi4wNSAzNzMuMTVoMzMuMzM0Yy4wODktNC4zMy00LjcyOS0zLjg2Mi01LjM1LTYuNS00Ljg4OS0xOC45MzItMTAuNjk3LTU3LjAyNC0xMC42OTctNTguNTc3IDAtMy41NjktLjc5Ni00LjE0MyAzLjY0OC02LjM1di0yLjg5OGgtMzMuMjk0cy0uMDU3LjY1LS43NjIgMS40NDFjLjY1IDEuNDMgMi43NSAyLjE1NSAzLjgzNyAzLjAwOCAxLjg2MyAxLjQ3NSAyLjgzNyAzLjg1MyAzLjM3NyA2LjQxNCAzLjcyNiAxNy44NDQgOS41MzcgNTMuMDAzIDkuNTM3IDU0LjU1NSAwIDMuMDI3LS4xNDUgMy43NjEtNC4yOTcgNi4wNDgtLjA0NS43ODEuNTc1IDIuMDIxLjY2NyAyLjg1OSIgZmlsbD0iIzMzNmZiZiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PHBhdGggZD0iTTMwMi4wNSAzNzMuMTVoMzMuMzM0Yy4wODktNC4zMy00LjcyOS0zLjg2Mi01LjM1LTYuNS00Ljg4OS0xOC45MzItMTAuNjk3LTU3LjAyNC0xMC42OTctNTguNTc3IDAtMy41NjktLjc5Ni00LjE0MyAzLjY0OC02LjM1di0yLjg5OGgtMzMuMjk0cy0uMDU3LjY1LS43NjIgMS40NDFjLjY1IDEuNDMgMi43NSAyLjE1NSAzLjgzNyAzLjAwOCAxLjg2MyAxLjQ3NSAyLjgzNyAzLjg1MyAzLjM3NyA2LjQxNCAzLjcyNiAxNy44NDQgOS41MzcgNTMuMDAzIDkuNTM3IDU0LjU1NSAwIDMuMDI3LS4xNDUgMy43NjEtNC4yOTcgNi4wNDgtLjA0NS43ODEuNTc1IDIuMDIxLjY2NyAyLjg1OXoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzNmZiZiIgc3Ryb2tlLW1pdGVybGltaXQ9IjMuODY0IiBzdHJva2Utd2lkdGg9Ii4yNSIvPjxwYXRoIGQ9Ik0zNDYuODQgMzczLjE4aDQwLjY5OXYtMi45MDdjLTEuMzQxLS43MjktMy4wMzEtMi4zMTEtMy4wMzEtMy44NjIgMC0xLjU1MyA3Ljk5OC0xMi41MzEgMTIuNjUzLTE4LjYyOSAxLjAwOCA1LjM1MyAyLjg2MyAxNS4yMTQgMi44NjMgMTYuNzY3IDAgMi40OC43OTkgMy41OTgtMy42NDggNS43Mjl2Mi44OTVoMTkuNjRzLjc2OC4wNjUuNzY4LTEuNDg3YzAtMS40NzMtNS4wNTMtLjg0OC03LjMwMS0xMC4wMDMtNC4yNjktMTcuNjktOS40NTktNTIuOTk0LTkuNDU5LTU0LjU0NiAwLS45MzIuNzc3LTUuMjc0IDQuMjU0LTUuMzY2LjA5LS44NDItLjUyOS0yLjA4Mi0uNjIyLTIuOTU1aC0yMC44MTljLS43Mi42NTQtLjgxIDEuNDkyLS42ODUgMi45ODYgNC4wODMtMS4xOTcgOS4yNjEgNi42NDkgOS4xOTcgMTAuODIzbC0zMi41MzMgNDUuNzI0LTkuMDY5LTUwLjMzNWMtLjQ2OS0yLjcxNSAzLjAzLTYuMTUxIDUuNDk1LTYuMjQzdi0yLjk0OGgtMjEuNDgzcy0uNzY4LS4wNjUtLjc2OCAxLjQ4NWMwIC43NzggNS45ODEgMy40MDEgNy4yMjUgOS4zNzUgMy44IDE3Ljg0NyA5LjUzNSA1My42MjQgOS41MzUgNTUuMTc1IDAgMS44NjMtLjA1MiAzLjQ0MS00LjI5NiA1LjQyLS4wNTEuNzg5LjY2MSAyLjI0NiAxLjM4NSAyLjkwMiIgZmlsbD0iIzMzNmZiZiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PHBhdGggZD0iTTM0Ni44NCAzNzMuMThoNDAuNjk5di0yLjkwN2MtMS4zNDEtLjcyOS0zLjAzMS0yLjMxMS0zLjAzMS0zLjg2MiAwLTEuNTUzIDcuOTk4LTEyLjUzMSAxMi42NTMtMTguNjI5IDEuMDA4IDUuMzUzIDIuODYzIDE1LjIxNCAyLjg2MyAxNi43NjcgMCAyLjQ4Ljc5OSAzLjU5OC0zLjY0OCA1LjcyOXYyLjg5NWgxOS42NHMuNzY4LjA2NS43NjgtMS40ODdjMC0xLjQ3My01LjA1My0uODQ4LTcuMzAxLTEwLjAwMy00LjI2OS0xNy42OS05LjQ1OS01Mi45OTQtOS40NTktNTQuNTQ2IDAtLjkzMi43NzctNS4yNzQgNC4yNTQtNS4zNjYuMDktLjg0Mi0uNTI5LTIuMDgyLS42MjItMi45NTVoLTIwLjgxOWMtLjcyLjY1NC0uODEgMS40OTItLjY4NSAyLjk4NiA0LjA4My0xLjE5NyA5LjI2MSA2LjY0OSA5LjE5NyAxMC44MjNsLTMyLjUzMyA0NS43MjQtOS4wNjktNTAuMzM1Yy0uNDY5LTIuNzE1IDMuMDMtNi4xNTEgNS40OTUtNi4yNDN2LTIuOTQ4aC0yMS40ODNzLS43NjgtLjA2NS0uNzY4IDEuNDg1YzAgLjc3OCA1Ljk4MSAzLjQwMSA3LjIyNSA5LjM3NSAzLjggMTcuODQ3IDkuNTM1IDUzLjYyNCA5LjUzNSA1NS4xNzUgMCAxLjg2My0uMDUyIDMuNDQxLTQuMjk2IDUuNDItLjA1MS43ODkuNjYxIDIuMjQ2IDEuMzg1IDIuOTAyeiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzM2ZmJmIiBzdHJva2UtbWl0ZXJsaW1pdD0iMy44NjQiIHN0cm9rZS13aWR0aD0iLjI1Ii8+PHBhdGggZD0iTTQ4NC45IDM3NS4wNmwxLjkzNS0yNS4zMjRoLTIuOTA1Yy0zLjY3MSAxMi42My0xNC4wOCAxNi4wNTMtMjEuODM5IDE2LjA1My04LjQ1NCAwLTEwLjU0OC04LjE0NS0xMC41NjgtMTQuMDQydi0yLjI2YzEuMDg5LS40ODkgMy4xMi0uNDU2IDQuNjc0LS40NTYgMy41NjkgMCAxMi41Ny4zMzggMTMuNDQ2IDguNTkzaDEuODFWMzI5LjIyYy00Ljg5OSAxLjgzNC0xLjc0OCA3LjA0Ni03Ljk1NCAxMC4zODItNC4wMzUgMi4xNzMtOC41MiAyLjI5Mi0xMi43NDkgMi4wMTQgMCAwLS41MS0uNTMtLjk0MS0xLjA4My0xLjM3NC05LjIzNy00LjQ3My0yNS45NDktNC40NzMtMjcuNTAxIDAtNi42NzIgMy40MTMtNi44MjcgOC4zNzctNi44MjcgMTAuNzg3IDAgMjMuMDgzIDYuNTk0IDMyLjEyMSAyMi4zMDMgMi4wMTUuMDQgMi4wMTUtLjU4MSAyLjkwMS0uNzI0bC0xNC4zNzQtMzAuMjJjLS43ODYtLjA1MS0xLjc5NSAxLjE5My0zLjM0NyAxLjIzOGgtNTYuNjIyYy0uMTY4IDQuNjgzIDQuMTMgNC4yMDIgNS4yOTMgNi42MDggMS4zMiAyLjcxNSAxMC43NTQgNTEuNTM0IDEwLjc1NCA1OC41MTcgMCAzLjQ4OS43OTQgNC4wNjYtMy42NTEgNi4zNTR2Mi45MTVoNTQuMTU3YzEuNTUyLjA0MSAyLjQyMiAxLjI0OCAzLjk1NSAxLjg2NCIgZmlsbD0iIzMzNmZiZiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PHBhdGggZD0iTTQ4NC45IDM3NS4wNmwxLjkzNS0yNS4zMjRoLTIuOTA1Yy0zLjY3MSAxMi42My0xNC4wOCAxNi4wNTMtMjEuODM5IDE2LjA1My04LjQ1NCAwLTEwLjU0OC04LjE0NS0xMC41NjgtMTQuMDQydi0yLjI2YzEuMDg5LS40ODkgMy4xMi0uNDU2IDQuNjc0LS40NTYgMy41NjkgMCAxMi41Ny4zMzggMTMuNDQ2IDguNTkzaDEuODFWMzI5LjIyYy00Ljg5OSAxLjgzNC0xLjc0OCA3LjA0Ni03Ljk1NCAxMC4zODItNC4wMzUgMi4xNzMtOC41MiAyLjI5Mi0xMi43NDkgMi4wMTQgMCAwLS41MS0uNTMtLjk0MS0xLjA4My0xLjM3NC05LjIzNy00LjQ3My0yNS45NDktNC40NzMtMjcuNTAxIDAtNi42NzIgMy40MTMtNi44MjcgOC4zNzctNi44MjcgMTAuNzg3IDAgMjMuMDgzIDYuNTk0IDMyLjEyMSAyMi4zMDMgMi4wMTUuMDQgMi4wMTUtLjU4MSAyLjkwMS0uNzI0bC0xNC4zNzQtMzAuMjJjLS43ODYtLjA1MS0xLjc5NSAxLjE5My0zLjM0NyAxLjIzOGgtNTYuNjIyYy0uMTY4IDQuNjgzIDQuMTMgNC4yMDIgNS4yOTMgNi42MDggMS4zMiAyLjcxNSAxMC43NTQgNTEuNTM0IDEwLjc1NCA1OC41MTcgMCAzLjQ4OS43OTQgNC4wNjYtMy42NTEgNi4zNTR2Mi45MTVoNTQuMTU3YzEuNTUyLjA0MSAyLjQyMiAxLjI0OCAzLjk1NSAxLjg2NHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzNmZiZiIgc3Ryb2tlLW1pdGVybGltaXQ9IjMuODY0IiBzdHJva2Utd2lkdGg9Ii4yNSIvPjxwYXRoIGQ9Ik01NjEuNzEgNDE0LjgyYzEuNTU1IDAgNS44OTctMi40ODMgNy40NDctMi40ODMgMS41NTUgMCAxLjY0Ni43MTIuOTkyIDEuNzMzIDEuNjMxLS41MjQuODgxLS44MyA0LjQzOC00LjA2My4wMTktLjEzLjU1NC0xLjkwMi0uOTczLTEuMjkyLTIuNzg4LjU3NS02LjAwNyAyLjM4MS03LjU2IDIuMzgxLTMuOTU1IDAtMTEuNzQzLTYuNDEzLTEzLjUyOC03LjE5LTQuMDM2LTEuNzg0LTcuODYzLS4yMDYtMTAuODg5LTQuNDczLTEuMTY0LTEuNjI4LS43MTctNC43ODYtLjcxNy02LjMzOCAwLTEwLjg1OSA2LjgyNi0xMi4zMzUgNi44MjYtMjIuNjUzIDAtMTUuNzUtMjQuODI0LTYwLjQwNC0zMi44MTQtNjkuNzE3LTEuMzk4LTEuNzA1LTcuNzYyLTExLjI4LTExLjU2My0xMS4yOC0xLjU1NCAwLTIuNjIyIDIuNTE2LTQuMDM3IDMuNDA1IDEzLjE5IDcuODgxIDQ0LjA3MSA2Ni4wMzEgNDQuMDcxIDgxLjYyNyAwIDcuMjEyLTcuNDQ5IDEzLjY1NC03LjQ0OSAyMy4yNzMgMCAxLjU1Mi0uMDQ0IDUuMjg0IDEuOTc1IDYuOTEzIDEuOTM5IDEuNjI5IDUuODg1IDEuNTk0IDguNzU2IDIuOTExIDMuMzM3IDEuNTUyIDExLjA3IDcuMjQ2IDE1LjAyNSA3LjI0NiIgZmlsbD0iIzMzNmZiZiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PHBhdGggZD0iTTU2MS43MSA0MTQuODJjMS41NTUgMCA1Ljg5Ny0yLjQ4MyA3LjQ0Ny0yLjQ4MyAxLjU1NSAwIDEuNjQ2LjcxMi45OTIgMS43MzMgMS42MzEtLjUyNC44ODEtLjgzIDQuNDM4LTQuMDYzLjAxOS0uMTMuNTU0LTEuOTAyLS45NzMtMS4yOTItMi43ODguNTc1LTYuMDA3IDIuMzgxLTcuNTYgMi4zODEtMy45NTUgMC0xMS43NDMtNi40MTMtMTMuNTI4LTcuMTktNC4wMzYtMS43ODQtNy44NjMtLjIwNi0xMC44ODktNC40NzMtMS4xNjQtMS42MjgtLjcxNy00Ljc4Ni0uNzE3LTYuMzM4IDAtMTAuODU5IDYuODI2LTEyLjMzNSA2LjgyNi0yMi42NTMgMC0xNS43NS0yNC44MjQtNjAuNDA0LTMyLjgxNC02OS43MTctMS4zOTgtMS43MDUtNy43NjItMTEuMjgtMTEuNTYzLTExLjI4LTEuNTU0IDAtMi42MjIgMi41MTYtNC4wMzcgMy40MDUgMTMuMTkgNy44ODEgNDQuMDcxIDY2LjAzMSA0NC4wNzEgODEuNjI3IDAgNy4yMTItNy40NDkgMTMuNjU0LTcuNDQ5IDIzLjI3MyAwIDEuNTUyLS4wNDQgNS4yODQgMS45NzUgNi45MTMgMS45MzkgMS42MjkgNS44ODUgMS41OTQgOC43NTYgMi45MTEgMy4zMzcgMS41NTIgMTEuMDcgNy4yNDYgMTUuMDI1IDcuMjQ2eiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzM2ZmJmIiBzdHJva2UtbWl0ZXJsaW1pdD0iMy44NjQiIHN0cm9rZS13aWR0aD0iLjI1Ii8+PHBhdGggZD0iTTQ5OS4xNiAzOTkuODljMS40MS03LjA0OSAyLjE4Ny0xNC42NDkgMy40MjUtMjEuMzIzIDEuMTY2LTYuMjA3IDQuODE3LTE3LjEyNiA0LjgxNy0xOC42NzggMC0xLjU1LTQuMTItNi44MTctNC44MTctOS45OTctMi4zMjgtMTAuMzk0LTIuNDAxLTIxLjA4My00LjEwOS0zMS42MzYtLjA3Ny0uNjIxLTEuMzE4LTEuNzc5LTEuNDcxLTMuMDk5LS4zODgtMi40ODEtLjE1NS02LjE2MS0uMTU1LTcuNzE0IDAtMS41NTItMi40ODMtNC4wMzQtMi40ODMtNS41ODQgMC0xLjU1NCAxLjIxLTEuNDEzIDEuODI5LTIuNzIzdi0yLjExNnMtLjg5Ny0uNzQ5LTEuNjgtLjdjLS43MzQgMS4zNjMtLjc2MSAzLjMwOC0uOTc4IDQuNDk0LS4zNjEuNTctMS42NTIuNDI0LTEuNjUyIDEuOTc2czEuODY5IDMuMDA2IDIuMjU0IDUuMDIzYy44NTQgNC4yNjguOTMyIDkuMzg4IDEuODY0IDE0LjI3NSAyLjU2IDEzLjAzNSAxLjI4MiAyNi40ODIgOC45MjEgMzguNzgzbC03LjI3IDMyLjI1MmMtNS4zMDgtMy4wOTItMTYuMzItOC43MTYtMTcuODcyLTguNzE2LTEuNTUzIDAtMi42NTUgMS45MTUtNC42NTUgMy40Mjl6IiBmaWxsPSIjMzM2ZmJmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48cGF0aCBkPSJNNDk5LjE2IDM5OS44OWMxLjQxLTcuMDQ5IDIuMTg3LTE0LjY0OSAzLjQyNS0yMS4zMjMgMS4xNjYtNi4yMDcgNC44MTctMTcuMTI2IDQuODE3LTE4LjY3OCAwLTEuNTUtNC4xMi02LjgxNy00LjgxNy05Ljk5Ny0yLjMyOC0xMC4zOTQtMi40MDEtMjEuMDgzLTQuMTA5LTMxLjYzNi0uMDc3LS42MjEtMS4zMTgtMS43NzktMS40NzEtMy4wOTktLjM4OC0yLjQ4MS0uMTU1LTYuMTYxLS4xNTUtNy43MTQgMC0xLjU1Mi0yLjQ4My00LjAzNC0yLjQ4My01LjU4NCAwLTEuNTU0IDEuMjEtMS40MTMgMS44MjktMi43MjN2LTIuMTE2cy0uODk3LS43NDktMS42OC0uN2MtLjczNCAxLjM2My0uNzYxIDMuMzA4LS45NzggNC40OTQtLjM2MS41Ny0xLjY1Mi40MjQtMS42NTIgMS45NzZzMS44NjkgMy4wMDYgMi4yNTQgNS4wMjNjLjg1NCA0LjI2OC45MzIgOS4zODggMS44NjQgMTQuMjc1IDIuNTYgMTMuMDM1IDEuMjgyIDI2LjQ4MiA4LjkyMSAzOC43ODNsLTcuMjcgMzIuMjUyYy01LjMwOC0zLjA5Mi0xNi4zMi04LjcxNi0xNy44NzItOC43MTYtMS41NTMgMC0yLjY1NSAxLjkxNS00LjY1NSAzLjQyOXoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzNmZiZiIgc3Ryb2tlLW1pdGVybGltaXQ9IjMuODY0IiBzdHJva2Utd2lkdGg9Ii4yNSIvPjxwYXRoIGQ9Ik01NjAuNDcgNTAyLjM0YzEwLjkzOCAwIDE1LjIwNi0xNi4wNTkgMTUuMjA2LTIyLjY1NCAwLTYuOTA2LS40OTItOC4zNDgtNC44MzktMTguMTI0LTEuMDA4LTIuMzI4LS42NjktNi4yODUtMi4yOTktOC4xNDgtMi43OTQtMy4xODItNy40NDQtNC4zMy0xMS4wMTYtNi40MjUtMi40ODQtMS40NzQtNS45NS00LjQwNC03LjgxMS03LjE5Ny0xLjg2Mi0yLjc5NC0yLjU5My02LjA5Ni0zLjIzOC05LjAwMSAxLjEwMS0uNDggMi45MjItMS4wODMgNC45ODgtMi4wNzEtMi44MzQuMTUyLTkuOTIzLTEuMTctOS45MjMgMy4xNzQgMCAxMC4wODcgMTAuMjU2IDE4Ljk3NSAyMi4yOCAyNS4xMDUgMi4yNTEgMS4xNjQgMS4wOTYgNS41ODMgMi4xMDUgNy45MS43NzYgMS45NCAyLjYyNSA0LjMxMyAzLjMyNSA2Ljc5NiAxLjA4NiAzLjY0NiAyLjA4MiAxMC4xNTQgMi4wODIgMTEuNzA1IDAgNC44ODgtMS4xOTYgMTAuMzExLTMuOTEgMTQuNzMzLS42Mi45My01LjAxMiAyLjk1Ni02LjMzMiAyLjk1Ni0xLjU1MiAwLTUuNTk3LTQuMDIxLTcuNDYxLTUuODg0LTMuMDI2LTMuMDI1LTcuODgtNy4xNzYtMTEuMzczLTExLjk4Ni0zLjE4LTQuNDIyLTMuMTk5LTQuNzA3LTMuMTk5LTguNTA4IDAtMS41NTEtNi40NDgtNC42OTYtMTAuMDk1LTYuNjM1LTQuODA5LTIuNTYxLTEwLjYwOC04LjA2NS0xNS4yNjEtMTQuMDM4LTEuMjQzLTEuNTUyLTIuODMzLTQuMjc4LTMuNjg2LTYuMTM5LTEuNTUtMy42NDgtMi40ODItNy42MDctNC4xMTItMTEuMTc1LTEuNzA3LTMuODc4LTQuNzgzLTkuMzMzLTQuODA4LTE0LjM3OGwtMjUuOTY2IDMuMDIzYy00LjUgMC01LjU4Ny4xNTQtNS41ODctNC4zNDYgMC0xLjU1MSAxLjg2Mi0xOS41MTYgMi45My0zMS4wMDEtLjk3NC42OC0xLjYyNiAxLjMzMy0yLjEzMSAyLjAyNi0uNzk2IDYuOTA3LTIuNjU5IDE5LjU4OC0yLjY0NiAyMS4xMzh2MTIuNjE0YzEuMzIgMS4zNCAzLjQgMS40MyA0Ljk1MiAxLjQzczE1LjI0LTEuODY0IDI2Ljc5Ni0zLjE3N2MuMzU5IDkuNjMyIDYuMzgzIDIyLjk3NyAxMi41MTEgMzIuMjExIDYuMzY0IDkuNTQxIDE4LjIwMiAxMy42MjkgMjQuOCAxOS44MDktLjE4IDcuODY0IDE4LjI4NSAyNi4yNTcgMjMuNzE4IDI2LjI1NyIgZmlsbD0iIzMzNmZiZiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PHBhdGggZD0iTTU2MC40NyA1MDIuMzRjMTAuOTM4IDAgMTUuMjA2LTE2LjA1OSAxNS4yMDYtMjIuNjU0IDAtNi45MDYtLjQ5Mi04LjM0OC00LjgzOS0xOC4xMjQtMS4wMDgtMi4zMjgtLjY2OS02LjI4NS0yLjI5OS04LjE0OC0yLjc5NC0zLjE4Mi03LjQ0NC00LjMzLTExLjAxNi02LjQyNS0yLjQ4NC0xLjQ3NC01Ljk1LTQuNDA0LTcuODExLTcuMTk3LTEuODYyLTIuNzk0LTIuNTkzLTYuMDk2LTMuMjM4LTkuMDAxIDEuMTAxLS40OCAyLjkyMi0xLjA4MyA0Ljk4OC0yLjA3MS0yLjgzNC4xNTItOS45MjMtMS4xNy05LjkyMyAzLjE3NCAwIDEwLjA4NyAxMC4yNTYgMTguOTc1IDIyLjI4IDI1LjEwNSAyLjI1MSAxLjE2NCAxLjA5NiA1LjU4MyAyLjEwNSA3LjkxLjc3NiAxLjk0IDIuNjI1IDQuMzEzIDMuMzI1IDYuNzk2IDEuMDg2IDMuNjQ2IDIuMDgyIDEwLjE1NCAyLjA4MiAxMS43MDUgMCA0Ljg4OC0xLjE5NiAxMC4zMTEtMy45MSAxNC43MzMtLjYyLjkzLTUuMDEyIDIuOTU2LTYuMzMyIDIuOTU2LTEuNTUyIDAtNS41OTctNC4wMjEtNy40NjEtNS44ODQtMy4wMjYtMy4wMjUtNy44OC03LjE3Ni0xMS4zNzMtMTEuOTg2LTMuMTgtNC40MjItMy4xOTktNC43MDctMy4xOTktOC41MDggMC0xLjU1MS02LjQ0OC00LjY5Ni0xMC4wOTUtNi42MzUtNC44MDktMi41NjEtMTAuNjA4LTguMDY1LTE1LjI2MS0xNC4wMzgtMS4yNDMtMS41NTItMi44MzMtNC4yNzgtMy42ODYtNi4xMzktMS41NS0zLjY0OC0yLjQ4Mi03LjYwNy00LjExMi0xMS4xNzUtMS43MDctMy44NzgtNC43ODMtOS4zMzMtNC44MDgtMTQuMzc4bC0yNS45NjYgMy4wMjNjLTQuNSAwLTUuNTg3LjE1NC01LjU4Ny00LjM0NiAwLTEuNTUxIDEuODYyLTE5LjUxNiAyLjkzLTMxLjAwMS0uOTc0LjY4LTEuNjI2IDEuMzMzLTIuMTMxIDIuMDI2LS43OTYgNi45MDctMi42NTkgMTkuNTg4LTIuNjQ2IDIxLjEzOHYxMi42MTRjMS4zMiAxLjM0IDMuNCAxLjQzIDQuOTUyIDEuNDNzMTUuMjQtMS44NjQgMjYuNzk2LTMuMTc3Yy4zNTkgOS42MzIgNi4zODMgMjIuOTc3IDEyLjUxMSAzMi4yMTEgNi4zNjQgOS41NDEgMTguMjAyIDEzLjYyOSAyNC44IDE5LjgwOS0uMTggNy44NjQgMTguMjg1IDI2LjI1NyAyMy43MTggMjYuMjU3eiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzM2ZmJmIiBzdHJva2UtbWl0ZXJsaW1pdD0iMy44NjQiIHN0cm9rZS13aWR0aD0iLjI1Ii8+PHBhdGggZD0iTTU1OC4xNyA0MjAuMWExLjI1MyAxLjI1MyAwIDEwMi41MDYtLjAwMiAxLjI1MyAxLjI1MyAwIDAwLTIuNTA2LjAwMiIgZmlsbD0iIzMzNmZiZiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PHBhdGggZD0iTTU1OC4xNyA0MjAuMWExLjI1MyAxLjI1MyAwIDEwMi41MDYtLjAwMiAxLjI1MyAxLjI1MyAwIDAwLTIuNTA2LjAwMnoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzNmZiZiIgc3Ryb2tlLW1pdGVybGltaXQ9IjMuODY0IiBzdHJva2Utd2lkdGg9Ii4yNSIvPjxwYXRoIGQ9Ik01NTAuOTIgNDI4Ljg5bDUuMTY4LTIuNjQzIiBmaWxsPSJub25lIiBzdHJva2U9IiMzMzZmYmYiIHN0cm9rZS1taXRlcmxpbWl0PSIzLjg2NCIgc3Ryb2tlLXdpZHRoPSIuMjY3Ii8+PHBhdGggZD0iTTU1NS45MSA0MjYuNDNsNC43NDQtMy45MDUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzNmZiZiIgc3Ryb2tlLW1pdGVybGltaXQ9IjMuODY0IiBzdHJva2Utd2lkdGg9Ii4yNSIvPjxwYXRoIGQ9Ik01NjAuNTEgNDIyLjY5bDEwLjIyOC04Ljk2OCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzM2ZmJmIiBzdHJva2UtbWl0ZXJsaW1pdD0iMy44NjQiIHN0cm9rZS13aWR0aD0iLjI5NSIvPjxwYXRoIGQ9Ik00OTQuNjMgMjk2LjMzbDcuMDA5LTUuMDgiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzNmZiZiIgc3Ryb2tlLW1pdGVybGltaXQ9IjMuODY0IiBzdHJva2Utd2lkdGg9Ii41NzEiLz48cGF0aCBkPSJNNDcwLjI4IDM5Mmw2Ljg4MS01Ljg0NyIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzM2ZmJmIiBzdHJva2UtbWl0ZXJsaW1pdD0iMy44NjQiIHN0cm9rZS13aWR0aD0iLjI1Ii8+PC9nPjwvc3ZnPg==');
  `)
  // Alter ticket option to reference the agency table
  pgm.sql(`
  ALTER TABLE ticket_options
    DROP COLUMN agency,
    DROP COLUMN logo_id,
    ADD COLUMN agency_id INTEGER REFERENCES agencies(id) ON DELETE CASCADE;
  `)

  pgm.sql(`
  UPDATE ticket_options SET agency_id = 1 WHERE id = 1;
  `)

  pgm.sql(`
  ALTER TABLE ticket_options ALTER COLUMN agency_id SET NOT NULL;
  `)
}

exports.down = pgm => {
  pgm.sql(`
  ALTER TABLE ticket_options
    DROP COLUMN agency_id,
    ADD COLUMN logo_id VARCHAR(100),
    ADD COLUMN agency VARCHAR(100)
  `)

  pgm.sql(`
  UPDATE ticket_options SET 
    agency = 'JT-Line', 
    logo_id = 'jt-logo.jpg' 
  WHERE id = 1;
  `)

  pgm.sql(`
  ALTER TABLE ticket_options ALTER COLUMN agency SET NOT NULL;
  `)

  pgm.sql(`
  DROP TABLE agencies;
  `)
}
